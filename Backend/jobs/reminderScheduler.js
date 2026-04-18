import Reminder from "../model/Reminder.js";
import Notification from "../model/Notification.js";

const TYPE_LABELS = {
  application_deadline: "Application deadline",
  scholarship_deadline: "Scholarship deadline",
  intake_date: "Intake / start date",
  visa_schedule: "Visa schedule",
  document_submission: "Document submission",
  interview: "Interview",
  exam: "Exam",
  other: "Reminder",
};

/**
 * Finds reminders whose notifyAt time has passed, creates in-app notifications,
 * marks them notified, and optionally pushes to Socket.IO room user:{userId}.
 */
export async function processDueReminders(io) {
  const now = new Date();
  const due = await Reminder.find({
    isCompleted: false,
    isNotified: false,
    notifyAt: { $lte: now },
  })
    .sort({ notifyAt: 1 })
    .limit(150);

  for (const r of due) {
    const label = TYPE_LABELS[r.type] || "Reminder";
    const when = new Date(r.reminderDate).toLocaleString();
    const msg = `${label}: ${r.title} — scheduled for ${when}`;

    await Notification.create({
      userId: r.userId,
      message: msg,
      type: "reminder",
    });

    r.isNotified = true;
    await r.save();

    io?.to(`user:${r.userId.toString()}`).emit("reminder-due", {
      reminderId: r._id.toString(),
      title: r.title,
      type: r.type,
      reminderDate: r.reminderDate,
    });
  }
}

export function startReminderScheduler(io) {
  const tick = () => {
    processDueReminders(io).catch((err) =>
      console.error("[reminderScheduler]", err)
    );
  };
  setInterval(tick, 60 * 1000);
  tick();
}
