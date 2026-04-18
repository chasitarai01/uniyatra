import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER || "test@example.com", 
        pass: process.env.EMAIL_PASS || "password123",
      },
    });

    const info = await transporter.sendMail({
      from: `"UniYatra Support" <${process.env.EMAIL_USER || "admin@uniyatra.com"}>`,
      to,
      subject,
      text,
      html: html || text,
    });

    console.log("Professional Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Professional Email Error: ", error);
    return false;
  }
};
