
import express from "express";
import {
  startAdminLogin,
  verifyAdminOtp,
  resendAdminOtp,
  getAdminSession,
} from "../controllers/adminAuthController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", startAdminLogin);
router.post("/verify-otp", verifyAdminOtp);
router.post("/resend-otp", resendAdminOtp);
router.get("/me", protect, getAdminSession);

export default router;
