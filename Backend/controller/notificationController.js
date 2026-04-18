import Notification from "../model/Notification.js";
import User from "../model/userModel.js";
import { sendEmail } from "../utils/email.js";

// Create notification and send professional email
export const createNotification = async (req, res) => {
  try {
    const { recipient, title, message, type } = req.body;

    // 1. Save internal dashboard notification
    const notification = new Notification({
      userId: recipient,
      message: `${title}: ${message}`,
      type,
    });
    await notification.save();

    // 2. Fetch user for professional email dispatch
    const user = await User.findById(recipient);
    if (user && user.email) {
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
          <div style="background-color: #4f46e5; padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: -0.5px;">UniYatra Virtual Learning</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #64748b; margin-bottom: 24px;">Hello ${user.username},</p>
            <h2 style="font-size: 20px; color: #1e293b; margin-bottom: 16px; font-weight: 800;">${title}</h2>
            <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 32px;">${message}</p>
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="http://localhost:5173/dashboard/classes" style="background-color: #4f46e5; color: #ffffff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">Join the Session Now</a>
            </div>
            <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">If you did not expect this invitation, please ignore this email or contact support if you have security concerns.</p>
          </div>
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 11px; color: #94a3b8; margin: 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">&copy; 2026 UniYatra Global Education. All rights reserved.</p>
          </div>
        </div>
      `;

      await sendEmail(user.email, title, message, emailHtml);
    }

    res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error("Notification System Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get notifications for logged user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};