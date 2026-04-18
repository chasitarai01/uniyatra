import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {
    // In production, configure these with actual SMTP credentials in .env
    // For this demonstration/professional setup, we fallback to ethereal or a test account 
    // if no env vars are provided, to prevent hard crashes.
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || "test@example.com", 
        pass: process.env.EMAIL_PASS || "password123",
      },
    });

    const info = await transporter.sendMail({
      from: `"UniYatra Admin" <${process.env.EMAIL_USER || "admin@uniyatra.com"}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
};
