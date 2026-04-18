import crypto from "crypto";
import Room from "../model/Room.js";
import User from "../model/userModel.js";
import Notification from "../model/Notification.js";
import { sendEmail } from "../utils/email.js";
import { getSocketIO } from "../realtimeHub.js";

// Generate a short unique room code e.g. "AB3X9K"
const generateRoomCode = () =>
  crypto.randomBytes(3).toString("hex").toUpperCase();

// ── Admin: Create a new room/class ────────────────────────────────────────────
export const createRoom = async (req, res) => {
  try {
    const { title, scheduledAt, maxParticipants, invitedUsers } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    // Ensure unique room code
    let roomCode;
    let exists = true;
    while (exists) {
      roomCode = generateRoomCode();
      exists = await Room.findOne({ roomCode });
    }

    const room = await Room.create({
      title,
      roomCode,
      createdBy: req.user._id,          // ← Mongoose doc uses _id
      scheduledAt: scheduledAt || null,
      maxParticipants: maxParticipants || 20,
      invitedUsers: invitedUsers || [], // Store invited users array
    });

    // If invited users exist, send notifications and emails
    if (invitedUsers && invitedUsers.length > 0) {
      const io = getSocketIO();
      for (const userId of invitedUsers) {
        const user = await User.findById(userId);
        if (!user) continue;

        const msg = `You have been invited to join the class: ${title}. Code: ${roomCode}`;
        
        // 1. Dashboard Notification
        await Notification.create({
          userId: user._id,
          message: msg,
          type: "class_invite",
        });

        // 2. Real-time WebSocket event
        if (io) {
          io.to(`user:${user._id.toString()}`).emit("new-class-invite", {
            roomId: room._id,
            title,
            roomCode,
          });
        }

        // 3. Email Notification
        await sendEmail(
          user.email,
          `Class Invitation: ${title}`,
          `Hello ${user.username},\n\nYou have been specially invited to join the class "${title}".\n\nYour secret class code is: ${roomCode}\n\nPlease join via the dashboard.`
        );
      }
    }

    res.status(201).json({ success: true, room });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ── Get all rooms (admin sees all, users see active only) ─────────────────────
export const getAllRooms = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { isActive: true };
    const rooms = await Room.find(filter)
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });
    res.json({ success: true, rooms });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ── Get single room by roomCode ───────────────────────────────────────────────
export const getRoomByCode = async (req, res) => {
  try {
    const room = await Room.findOne({
      roomCode: req.params.roomCode.toUpperCase(),
    }).populate("createdBy", "username email");

    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!room.isActive)
      return res.status(403).json({ message: "This room has been closed" });

    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ── Join a room ───────────────────────────────────────────────────────────────
export const joinRoom = async (req, res) => {
  try {
    const room = await Room.findOne({
      roomCode: req.params.roomCode.toUpperCase(),
    });

    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!room.isActive)
      return res.status(403).json({ message: "Room is closed" });
    if (room.participants.length >= room.maxParticipants)
      return res.status(403).json({ message: "Room is full" });

    // Enforce Invitation Logic
    if (room.invitedUsers && room.invitedUsers.length > 0) {
      const isInvited = room.invitedUsers.some(
        (id) => id.toString() === req.user._id.toString()
      );
      if (!isInvited) {
        return res.status(403).json({ message: "Access Denied: You were not invited to this class." });
      }
    }

    const alreadyIn = room.participants.find(
      (p) => p.userId.toString() === req.user._id.toString()
    );
    if (!alreadyIn) {
      room.participants.push({
        userId:   req.user._id,
        username: req.user.username || req.user.email,
      });
      await room.save();
    }

    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ── Admin: Close a room ───────────────────────────────────────────────────────
export const closeRoom = async (req, res) => {
  try {
    const room = await Room.findOne({
      roomCode: req.params.roomCode.toUpperCase(),
    });

    if (!room) return res.status(404).json({ message: "Room not found" });
    if (
      room.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    room.isActive = false;
    await room.save();

    res.json({ success: true, message: "Room closed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ── Admin: Delete a room ──────────────────────────────────────────────────────
export const deleteRoom = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    await Room.findOneAndDelete({
      roomCode: req.params.roomCode.toUpperCase(),
    });
    res.json({ success: true, message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};