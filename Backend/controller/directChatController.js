import DirectChatThread from "../model/DirectChatThread.js";
import DirectChatMessage from "../model/DirectChatMessage.js";
import User from "../model/userModel.js";
import { getSocketIO } from "../realtimeHub.js";

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: [] });

    // Find users matching search query but not self
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } },
        {
          $or: [
            { username: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
          ],
        },
      ],
    })
      .select("username email role")
      .limit(10)
      .lean();

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyThreads = async (req, res) => {
  try {
    const threads = await DirectChatThread.find({
      participants: req.user._id,
    })
      .populate("participants", "username email role")
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .lean();

    res.json({ success: true, data: threads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrGetThread = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) {
      return res.status(400).json({ success: false, message: "targetUserId is required" });
    }

    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "Cannot chat with yourself" });
    }

    // Check if thread exists with exactly these two participants
    let thread = await DirectChatThread.findOne({
      participants: { $all: [req.user._id, targetUserId] },
    }).populate("participants", "username email role");

    if (!thread) {
      thread = await DirectChatThread.create({
        participants: [req.user._id, targetUserId],
      });
      thread = await thread.populate("participants", "username email role");
    }

    res.json({ success: true, data: thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const threadId = req.params.id;
    const thread = await DirectChatThread.findById(threadId);

    if (!thread || !thread.participants.includes(req.user._id)) {
      return res.status(404).json({ success: false, message: "Thread not found or unauthorized" });
    }

    const messages = await DirectChatMessage.find({ threadId })
      .sort({ createdAt: 1 })
      .limit(500)
      .lean();

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const threadId = req.params.id;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Message text is required" });
    }

    const thread = await DirectChatThread.findById(threadId);

    if (!thread || !thread.participants.includes(req.user._id)) {
      return res.status(404).json({ success: false, message: "Thread not found or unauthorized" });
    }

    const message = await DirectChatMessage.create({
      threadId,
      senderId: req.user._id,
      text: text.trim(),
    });

    thread.lastMessageAt = new Date();
    await thread.save();

    const payload = {
      _id: message._id,
      threadId,
      senderId: req.user._id,
      text: message.text,
      createdAt: message.createdAt,
    };

    // Broadcast via socket to everyone in the room
    const io = getSocketIO();
    if (io) {
      io.to(`direct:${threadId}`).emit("direct:new-message", payload);
    }

    res.status(201).json({ success: true, data: payload });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
