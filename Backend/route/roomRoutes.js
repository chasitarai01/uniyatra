import express from "express";
import {
  createRoom,
  getAllRooms,
  getRoomByCode,
  joinRoom,
  closeRoom,
  deleteRoom,
} from "../controller/roomController.js";


import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

//  logged-in user
router.get("/",                protect, getAllRooms);
router.get("/:roomCode",       protect, getRoomByCode);
router.post("/:roomCode/join", protect, joinRoom);

// Admin only
router.post("/",                   protect, adminOnly, createRoom);
router.put("/:roomCode/close",     protect, adminOnly, closeRoom);
router.delete("/:roomCode",        protect, adminOnly, deleteRoom);

export default router;