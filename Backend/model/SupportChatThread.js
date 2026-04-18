import mongoose from "mongoose";

const supportChatThreadSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    topic: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "Support",
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
      index: true,
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

supportChatThreadSchema.index({ studentId: 1, status: 1, updatedAt: -1 });

export default mongoose.model("SupportChatThread", supportChatThreadSchema);
