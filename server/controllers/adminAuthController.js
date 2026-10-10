
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AdminOtp from "../models/AdminOtp.js";
import sendEmail from "../utils/sendEmail.js";

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

// Create a persistent admin token (7 days).
const createAdminToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in server/.env");
  }

  return jwt.sign(
    { id: user._id.toString(), role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

// Generate and send OTP to the registered admin email.
async function sendAdminOtp(user) {
  const now = Date.now();
  const recipientEmail = String(user.email || "").trim().toLowerCase();

  if (!recipientEmail) {
    throw new Error("Admin email is missing in the database.");
  }

  const existing = await AdminOtp.findOne({ userId: user._id });

  if (existing) {
    const elapsed = now - new Date(existing.lastSentAt).getTime();

    if (elapsed < RESEND_COOLDOWN_MS) {
      return {
        limited: true,
        waitSeconds: Math.ceil(
          (RESEND_COOLDOWN_MS - elapsed) / 1000
        ),
      };
    }
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  await AdminOtp.findOneAndUpdate(
    { userId: user._id },
    {
      $set: {
        otpHash: hashOtp(otp),
        expiresAt: new Date(now + OTP_EXPIRY_MS),
        attempts: 0,
        lastSentAt: new Date(now),
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );

  try {
    const result = await sendEmail({
      to: recipientEmail,
      subject: "Your New India Fashion admin login OTP",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:20px">
          <h2>New India Fashion</h2>
          <p>Your admin login verification code is:</p>
          <div style="font-size:30px;font-weight:bold;letter-spacing:8px;margin:20px 0">
            ${otp}
          </div>
          <p>This code expires in 10 minutes.</p>
          <p>For your security, do not share this code with anyone.</p>
        </div>
      `,
    });

    console.log("Admin OTP email accepted:", result.accepted);
    console.log("Admin OTP email rejected:", result.rejected);
  } catch (error) {
    await AdminOtp.deleteOne({ userId: user._id });
    console.error("Admin OTP email failed:", error.message);
    throw error;
  }

  return { limited: false };
}

// STEP 1: Check credentials and send OTP.
export const startAdminLogin = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });

    if (
      !user ||
      user.role !== "admin" ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const result = await sendAdminOtp(user);

    if (result.limited) {
      return res.status(429).json({
        success: false,
        message: `Please wait ${result.waitSeconds} seconds before requesting another OTP.`,
        retryAfter: result.waitSeconds,
      });
    }

    return res.status(200).json({
      success: true,
      otpRequired: true,
      message: "OTP sent to your registered admin email.",
    });
  } catch (error) {
    console.error("Admin login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to start admin login. Please check server logs.",
    });
  }
};

// STEP 2: Verify OTP and issue token.
export const verifyAdminOtp = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();

    if (!email || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Enter the registered email and a valid 6-digit OTP.",
      });
    }

    const user = await User.findOne({ email, role: "admin" });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    const record = await AdminOtp.findOne({ userId: user._id });

    if (!record) {
      return res.status(401).json({
        success: false,
        message: "OTP not found. Please log in again.",
      });
    }

    if (new Date(record.expiresAt).getTime() <= Date.now()) {
      await AdminOtp.deleteOne({ _id: record._id });

      return res.status(401).json({
        success: false,
        message: "OTP expired. Please log in again.",
      });
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      await AdminOtp.deleteOne({ _id: record._id });

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please log in again.",
      });
    }

    if (hashOtp(otp) !== record.otpHash) {
      record.attempts += 1;
      await record.save();

      return res.status(401).json({
        success: false,
        message: `Incorrect OTP. ${
          MAX_ATTEMPTS - record.attempts
        } attempts remaining.`,
      });
    }

    // Consume OTP after successful verification.
    await AdminOtp.deleteOne({ _id: record._id });

    const token = createAdminToken(user);

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP. Please try again.",
    });
  }
};

// STEP 3: Verify the existing admin session.
export const getAdminSession = async (req, res) => {
  try {
    // JWT middleware must set req.user after verifying the token.
    if (!req.user?.id || req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Admin session is invalid. Please log in again.",
      });
    }

    const user = await User.findById(req.user.id)
      .select("_id name email role");

    if (!user || user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Admin session is invalid. Please log in again.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin session error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify admin session.",
    });
  }
};

// Resend OTP after cooldown.
export const resendAdminOtp = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required to resend OTP.",
      });
    }

    const user = await User.findOne({ email });

    if (
      !user ||
      user.role !== "admin" ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const result = await sendAdminOtp(user);

    if (result.limited) {
      return res.status(429).json({
        success: false,
        message: `Please wait ${result.waitSeconds} seconds before requesting another OTP.`,
        retryAfter: result.waitSeconds,
      });
    }

    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your registered email.",
    });
  } catch (error) {
    console.error("Resend OTP error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to resend OTP. Please try again.",
    });
  }
};