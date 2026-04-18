import Reminder from "../model/Reminder.js";

const VALID_TYPES = new Set([
  "application_deadline",
  "scholarship_deadline",
  "intake_date",
  "visa_schedule",
  "document_submission",
  "interview",
  "exam",
  "other",
]);

/** Maps legacy UI values to stored enum values */
const TYPE_ALIASES = {
  deadline: "application_deadline",
  application: "application_deadline",
};

function normalizeReminderType(type) {
  if (!type) return "other";
  if (TYPE_ALIASES[type]) return TYPE_ALIASES[type];
  if (VALID_TYPES.has(type)) return type;
  return "other";
}

// ➕ Create a new reminder
export const createReminder = async (req, res) => {
  try {
    const {
      universityId,
      title,
      description,
      type,
      reminderDate,
      notifyBefore,
      priority,
    } = req.body;

    const userId = req.user._id; // from auth middleware

    const reminder = new Reminder({
      userId,
      universityId: universityId || null,
      title,
      description,
      type: normalizeReminderType(type),
      reminderDate: new Date(reminderDate),
      notifyBefore: notifyBefore ?? 1440,
      priority,
    });

    await reminder.save();

    res.status(201).json({
      success: true,
      message: "Reminder created successfully",
      data: reminder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📋 Get all reminders for the logged-in user
export const getUserReminders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, isCompleted, priority } = req.query;

    const filter = { userId };
    if (type) filter.type = normalizeReminderType(type);
    if (isCompleted !== undefined) filter.isCompleted = isCompleted === "true";
    if (priority) filter.priority = priority;

    const reminders = await Reminder.find(filter)
      .populate("universityId", "University Country Logo")
      .sort({ reminderDate: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔍 Get a single reminder by ID
export const getReminderById = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("universityId", "University Country Logo");

    if (!reminder) {
      return res
        .status(404)
        .json({ success: false, message: "Reminder not found" });
    }

    res.status(200).json({ success: true, data: reminder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update a reminder
export const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!reminder) {
      return res
        .status(404)
        .json({ success: false, message: "Reminder not found" });
    }

    const allowedUpdates = [
      "title",
      "description",
      "type",
      "reminderDate",
      "notifyBefore",
      "priority",
      "isCompleted",
      "universityId",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "reminderDate") {
          reminder[field] = new Date(req.body[field]);
        } else if (field === "type") {
          reminder[field] = normalizeReminderType(req.body[field]);
        } else {
          reminder[field] = req.body[field];
        }
      }
    });

    await reminder.save(); // triggers pre-save hook to recalculate notifyAt

    res.status(200).json({
      success: true,
      message: "Reminder updated successfully",
      data: reminder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Mark reminder as completed
export const markAsCompleted = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isCompleted: true },
      { new: true }
    );

    if (!reminder) {
      return res
        .status(404)
        .json({ success: false, message: "Reminder not found" });
    }

    res.status(200).json({
      success: true,
      message: "Reminder marked as completed",
      data: reminder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🗑️ Delete a reminder
export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!reminder) {
      return res
        .status(404)
        .json({ success: false, message: "Reminder not found" });
    }

    res.status(200).json({
      success: true,
      message: "Reminder deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔔 Get upcoming reminders (due in next 24 hours)
export const getUpcomingReminders = async (req, res) => {
  try {
    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const reminders = await Reminder.find({
      userId: req.user._id,
      isCompleted: false,
      reminderDate: { $gte: now, $lte: next24h },
    })
      .populate("universityId", "University Country")
      .sort({ reminderDate: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
