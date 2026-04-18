import SupportChatThread from "../model/SupportChatThread.js";
import SupportChatMessage from "../model/SupportChatMessage.js";
import {
  encryptMessagePlaintext,
  decryptMessageFields,
} from "../utils/chatCrypto.js";
import { getSocketIO } from "../realtimeHub.js";

const MAX_MESSAGE_LEN = 8000;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 40;
const postBuckets = new Map(); // userId -> { count, resetAt }

function rateLimitOk(userId) {
  const now = Date.now();
  const k = userId.toString();
  let b = postBuckets.get(k);
  if (!b || now > b.resetAt) {
    b = { count: 0, resetAt: now + RATE_WINDOW_MS };
    postBuckets.set(k, b);
  }
  if (b.count >= RATE_MAX) return false;
  b.count += 1;
  return true;
}

async function assertThreadAccess(thread, user) {
  if (!thread) return false;
  const uid = user._id.toString();
  const sid = thread.studentId.toString();
  if (sid === uid) return true;
  if (user.role === "admin") return true;
  return false;
}

function senderRoleFor(user, thread) {
  return user._id.toString() === thread.studentId.toString()
    ? "student"
    : "admin";
}

export const createOrGetOpenThread = async (req, res) => {
  try {
    const userId = req.user._id;
    if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins cannot open student threads via this endpoint",
      });
    }
    const topic = (req.body?.topic || "Support").toString().slice(0, 200);
    let thread = await SupportChatThread.findOne({
      studentId: userId,
      status: "open",
    }).sort({ updatedAt: -1 });
    if (!thread) {
      thread = await SupportChatThread.create({ studentId: userId, topic });
    }
    res.status(200).json({ success: true, data: thread });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const listMyThreads = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ success: false, message: "Use /threads/all" });
    }
    const threads = await SupportChatThread.find({ studentId: req.user._id })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .limit(50)
      .lean();
    res.json({ success: true, data: threads });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const listAllThreadsAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admins only" });
    }
    const threads = await SupportChatThread.find()
      .populate("studentId", "fullName email")
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .limit(200)
      .lean();
    res.json({ success: true, data: threads });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getThread = async (req, res) => {
  try {
    const thread = await SupportChatThread.findById(req.params.id);
    if (!(await assertThreadAccess(thread, req.user))) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, data: thread });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const listMessages = async (req, res) => {
  try {
    const thread = await SupportChatThread.findById(req.params.id);
    if (!(await assertThreadAccess(thread, req.user))) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    const rows = await SupportChatMessage.find({ threadId: thread._id })
      .sort({ createdAt: 1 })
      .limit(500)
      .lean();

    const data = rows.map((m) => {
      let text = "";
      try {
        text = decryptMessageFields({
          ciphertextB64: m.ciphertextB64,
          ivB64: m.ivB64,
          tagB64: m.tagB64,
        });
      } catch {
        text = "[Unable to decrypt — check CHAT_ENCRYPTION_KEY]";
      }
      return {
        _id: m._id,
        threadId: m.threadId,
        senderId: m.senderId,
        senderRole: m.senderRole,
        text,
        createdAt: m.createdAt,
      };
    });
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const postMessage = async (req, res) => {
  try {
    if (!rateLimitOk(req.user._id)) {
      return res.status(429).json({ success: false, message: "Too many messages" });
    }
    const thread = await SupportChatThread.findById(req.params.id);
    if (!(await assertThreadAccess(thread, req.user))) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    if (thread.status === "closed") {
      return res.status(400).json({ success: false, message: "Thread is closed" });
    }

    const text = (req.body?.text ?? "").toString().trim();
    if (!text || text.length > MAX_MESSAGE_LEN) {
      return res.status(400).json({
        success: false,
        message: `Message required, max ${MAX_MESSAGE_LEN} characters`,
      });
    }

    const enc = encryptMessagePlaintext(text);
    const senderRole = senderRoleFor(req.user, thread);

    const msg = await SupportChatMessage.create({
      threadId: thread._id,
      senderId: req.user._id,
      senderRole,
      ciphertextB64: enc.ciphertextB64,
      ivB64: enc.ivB64,
      tagB64: enc.tagB64,
    });

    thread.lastMessageAt = new Date();
    await thread.save();

    const payload = {
      _id: msg._id.toString(),
      threadId: thread._id.toString(),
      senderId: req.user._id.toString(),
      senderRole,
      text,
      createdAt: msg.createdAt,
    };

    getSocketIO()?.to(`support:${thread._id}`).emit("support:new-message", payload);

    res.status(201).json({ success: true, data: payload });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const closeThread = async (req, res) => {
  try {
    const thread = await SupportChatThread.findById(req.params.id);
    if (!(await assertThreadAccess(thread, req.user))) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    const isOwner = thread.studentId.equals(req.user._id);
    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }
    thread.status = "closed";
    await thread.save();
    res.json({ success: true, data: thread });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
