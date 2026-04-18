// socketHandler.js
// Usage in server.js:
//   import { Server } from "socket.io";
//   import setupSocket from "./socketHandler.js";
//   const io = new Server(server, { cors: { origin: "*" } });
//   setupSocket(io);

const setupSocket = (io) => {
    // roomCode → Set of socket ids
    const rooms = {};
  
    io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.id}`);
  
      // ── Join room ──────────────────────────────────────────────────────────────
      socket.on("join-room", ({ roomCode, userId, username }) => {
        socket.join(roomCode);
        socket.roomCode = roomCode;
        socket.userId   = userId;
        socket.username = username;
  
        if (!rooms[roomCode]) rooms[roomCode] = new Set();
        rooms[roomCode].add(socket.id);
  
        // Tell existing peers someone new arrived
        socket.to(roomCode).emit("user-joined", {
          socketId: socket.id,
          userId,
          username,
        });
  
        // Send new joiner the list of existing peer socket ids
        const existingPeers = [...rooms[roomCode]].filter(
          (id) => id !== socket.id
        );
        socket.emit("existing-peers", existingPeers);
  
        console.log(`${username} joined room ${roomCode}`);
      });
  
      // ── WebRTC signaling ───────────────────────────────────────────────────────
  
      socket.on("offer", ({ to, offer }) => {
        io.to(to).emit("offer", { from: socket.id, offer });
      });
  
      socket.on("answer", ({ to, answer }) => {
        io.to(to).emit("answer", { from: socket.id, answer });
      });
  
      socket.on("ice-candidate", ({ to, candidate }) => {
        io.to(to).emit("ice-candidate", { from: socket.id, candidate });
      });
  
      // ── Media state ────────────────────────────────────────────────────────────
  
      socket.on("toggle-video", ({ roomCode, enabled }) => {
        socket.to(roomCode).emit("peer-video-toggle", {
          socketId: socket.id,
          enabled,
        });
      });
  
      socket.on("toggle-audio", ({ roomCode, enabled }) => {
        socket.to(roomCode).emit("peer-audio-toggle", {
          socketId: socket.id,
          enabled,
        });
      });
  
      // ── Chat ───────────────────────────────────────────────────────────────────
  
      socket.on("chat-message", ({ roomCode, message, username }) => {
        io.to(roomCode).emit("chat-message", {
          socketId: socket.id,
          username,
          message,
          time: new Date().toISOString(),
        });
      });
  
      // ── Admin ends call ────────────────────────────────────────────────────────
  
      socket.on("end-room", ({ roomCode }) => {
        io.to(roomCode).emit("room-ended");
      });
  
      // ── Disconnect ─────────────────────────────────────────────────────────────
  
      socket.on("disconnect", () => {
        const { roomCode, userId, username } = socket;
        if (roomCode && rooms[roomCode]) {
          rooms[roomCode].delete(socket.id);
          if (rooms[roomCode].size === 0) delete rooms[roomCode];
          socket.to(roomCode).emit("user-left", {
            socketId: socket.id,
            userId,
            username,
          });
        }
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });
  };
  
  export default setupSocket;