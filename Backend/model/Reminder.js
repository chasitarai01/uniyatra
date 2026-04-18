import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      default: null, // optional — null for general reminders
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "application_deadline",
        "scholarship_deadline",
        "intake_date",
        "visa_schedule",
        "document_submission",
        "interview",
        "exam",
        "other",
      ],
      default: "other",
    },
    reminderDate: {
      type: Date,
      required: true,
    },
    notifyBefore: {
      type: Number, // minutes before reminderDate to notify
      default: 1440, // 24 hours
    },
    notifyAt: {
      type: Date, // auto-calculated
    },
    isNotified: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

// Auto-calculate notifyAt before saving
reminderSchema.pre("save", function (next) {
  if (this.reminderDate && this.notifyBefore !== undefined) {
    this.notifyAt = new Date(
      this.reminderDate.getTime() - this.notifyBefore * 60 * 1000
    );
  }
  next();
});

const Reminder = mongoose.model("Reminder", reminderSchema);
export default Reminder;
