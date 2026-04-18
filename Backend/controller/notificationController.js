import Notification from "../model/Notification.js";

// Create notification
export const createNotification = async (req, res) => {
  try {
    const { userId, message, type } = req.body;

    const notification = new Notification({
      userId,
      message,
      type,
    });

    await notification.save();

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
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