import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";

import connectDB from "./config/mongodb.js";
import userroute from "./route/userRoute.js";
import universityRoutes from "./route/UniRoute.js";
import scholarshipRoute from "./route/scholarshipRoute.js";
import courseRoute from "./route/CourseRoute.js";
import fileRoute from "./route/fileRoute.js";
import favoriteRoutes from "./route/favoriteroute.js";
import { connectCloudinary } from "./middleware/cloudinary.js";
import checklistRoutes from "./route/checklist.route.js";
import eligibilityRoutes from "./route/eligibilityTestRoute.js";
import notificationRoutes from "./route/notificationRoutes.js";
import roomRoutes from "./route/roomRoutes.js";
import setupSocket from "./socketHandler.js";
import reminderRoutes from "./route/reminderRoutes.js";
import supportChatRoutes from "./route/supportChatRoutes.js";
import directChatRoutes from "./route/directChatRoutes.js";
import costRoutes from "./route/costRoute.js";
import { setSocketIO } from "./realtimeHub.js";
import { registerSupportChatSocket } from "./supportChatSocket.js";
import { registerDirectChatSocket } from "./directChatSocket.js";
import { startReminderScheduler } from "./jobs/reminderScheduler.js";
dotenv.config();
connectDB();
await connectCloudinary();

const app = express();  
const port = process.env.PORT || 5001;

// Middleware
const allowedOrigins = [
  "https://uniyatra.vercel.app",
  "https://uniyatra-puf6gxgmj-chasitarai-9465s-projects.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => cb(null, true), // allow all for API
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Static Files (Production)
const frontendPath = path.join(__dirname, "../Frontend/dist");
app.use(express.static(frontendPath));

// Routes
app.use("/api/auth", userroute);
app.use("/api/universities", universityRoutes);
app.use("/api/scholarships", scholarshipRoute);
app.use("/api/courses", courseRoute);
app.use("/api/file", fileRoute);
app.use("/api/checklist", checklistRoutes);
app.use("/api/eligibility", eligibilityRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/support-chat", supportChatRoutes);
app.use("/api/direct-chat", directChatRoutes);
app.use("/api/cost-estimator", costRoutes);

// Fallback for React Router
app.get(/.*/, (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API route not found" });
  }
  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) {
      res.status(500).send("Frontend build not found. Please run 'npm run build' in the Frontend directory.");
    }
  });
});

// ⚡ Create HTTP server and attach Socket.IO with production-grade CORS
const server = createServer(app); 
const io = new Server(server, {
  cors: {
    origin: (origin, cb) => cb(null, true), // allow all origins for websocket
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000
});

// Setup Socket.IO handlers
setupSocket(io);
setSocketIO(io);
registerSupportChatSocket(io);
registerDirectChatSocket(io);

// Start the automated reminder scheduler
startReminderScheduler(io);

// Start server with port conflict handling
server.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use. Please kill the process or try a different port.`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
  }
});