import jwt from "jsonwebtoken";

export const registerDirectChatSocket = (io) => {
  io.on("connection", (socket) => {
    // Client joins a specific direct chat thread
    socket.on("direct:join-thread", ({ threadId, token }, callback) => {
      try {
        if (!token) throw new Error("No token provided");
        // Just verify it's a valid user token, optionally check if they belong to threadId
        jwt.verify(token, process.env.JWT_SECRET);
        
        const roomName = `direct:${threadId}`;
        socket.join(roomName);
        if (typeof callback === "function") callback({ ok: true });
      } catch (e) {
        if (typeof callback === "function") callback({ ok: false, error: e.message });
      }
    });

    socket.on("direct:leave-thread", ({ threadId }) => {
      const roomName = `direct:${threadId}`;
      socket.leave(roomName);
    });
  });
};
