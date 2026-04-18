import jwt from "jsonwebtoken";
import User from "./model/userModel.js";
import SupportChatThread from "./model/SupportChatThread.js";

/**
 * Socket.IO: authenticated join to support:{threadId} for live delivery.
 * Client sends JWT in handshake auth or in join payload (fallback).
 */
export function registerSupportChatSocket(io) {
  io.on("connection", (socket) => {
    socket.on("support:join-thread", async (payload, cb) => {
      try {
        const threadId = payload?.threadId;
        const token =
          payload?.token ||
          socket.handshake?.auth?.token ||
          (typeof socket.handshake?.headers?.authorization === "string"
            ? socket.handshake.headers.authorization.replace(/^Bearer\s+/i, "")
            : null);
        if (!threadId || !token) {
          return cb?.({ ok: false, error: "threadId and token required" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return cb?.({ ok: false, error: "user" });

        const thread = await SupportChatThread.findById(threadId);
        if (!thread) return cb?.({ ok: false, error: "thread" });

        const uid = user._id.toString();
        const sid = thread.studentId.toString();
        const allowed = uid === sid || user.role === "admin";
        if (!allowed) return cb?.({ ok: false, error: "forbidden" });

        socket.join(`support:${threadId}`);
        socket.supportThreadRooms = socket.supportThreadRooms || new Set();
        socket.supportThreadRooms.add(`support:${threadId}`);
        return cb?.({ ok: true });
      } catch {
        return cb?.({ ok: false, error: "auth" });
      }
    });

    socket.on("support:leave-thread", ({ threadId }) => {
      if (threadId) socket.leave(`support:${threadId}`);
    });

    socket.on("disconnect", () => {
      if (socket.supportThreadRooms instanceof Set) {
        for (const room of socket.supportThreadRooms) {
          socket.leave(room);
        }
      }
    });
  });
}
