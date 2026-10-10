const sendEmail = async ({ to, subject, text }) => {
  console.log("Email service:", {
    to,
    subject,
    text,
  });
};

export default sendEmail;