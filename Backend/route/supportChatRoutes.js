import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import {
  createOrGetOpenThread,
  listMyThreads,
  listAllThreadsAdmin,
  getThread,
  listMessages,
  postMessage,
  closeThread,
} from "../controller/supportChatController.js";

const router = express.Router();

router.post("/threads", isAuthenticated, createOrGetOpenThread);
router.get("/threads/me", isAuthenticated, listMyThreads);
router.get("/threads/all", isAuthenticated, listAllThreadsAdmin);
router.get("/threads/:id", isAuthenticated, getThread);
router.get("/threads/:id/messages", isAuthenticated, listMessages);
router.post("/threads/:id/messages", isAuthenticated, postMessage);
router.patch("/threads/:id/close", isAuthenticated, closeThread);

export default router;
