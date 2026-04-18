import mongoose from "mongoose";

const directChatThreadSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for quickly finding threads a user is part of
directChatThreadSchema.index({ participants: 1, updatedAt: -1 });

export default mongoose.model("DirectChatThread", directChatThreadSchema);
