import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPassword = process.env.EMAIL_APP_PASSWORD?.trim();

  // Check email configuration
  console.log("Email configured:", Boolean(emailUser));
  console.log("App password configured:", Boolean(emailPassword));

  if (!emailUser || !emailPassword) {
    throw new Error(
      "EMAIL_USER or EMAIL_APP_PASSWORD is missing in server/.env"
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });

  try {
    const result = await transporter.sendMail({
      from: emailUser,
      to,
      subject,
      html,
    });

    // Email delivery diagnostics
    console.log("Email sent successfully:", result.messageId);
    console.log("Accepted recipients:", result.accepted);
    console.log("Rejected recipients:", result.rejected);
    console.log("SMTP response:", result.response);

    return result;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};

export default sendEmail;