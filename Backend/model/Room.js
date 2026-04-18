import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    roomCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    invitedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    participants: [
      {
        userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    maxParticipants: {
      type: Number,
      default: 20,
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;