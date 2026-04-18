import express from "express";
import {
  createNotification,
  getNotifications,
  markAsRead,
} from "../controller/notificationController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createNotification);

router.get("/", isAuthenticated, getNotifications);

router.put("/:id/read", isAuthenticated, markAsRead);

export default router;