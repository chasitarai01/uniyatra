import express from "express";
import {
  createReminder,
  getUserReminders,
  getReminderById,
  updateReminder,
  markAsCompleted,
  deleteReminder,
  getUpcomingReminders,
} from "../controller/reminderController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";  

const router = express.Router();

// All routes protected with isAuthenticated
router.post("/", isAuthenticated, createReminder);
router.get("/", isAuthenticated, getUserReminders);
router.get("/upcoming", isAuthenticated, getUpcomingReminders);
router.get("/:id", isAuthenticated, getReminderById);
router.put("/:id", isAuthenticated, updateReminder);
router.patch("/:id/complete", isAuthenticated, markAsCompleted);
router.delete("/:id", isAuthenticated, deleteReminder);

export default router;