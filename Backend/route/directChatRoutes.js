import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import {
  searchUsers,
  getMyThreads,
  createOrGetThread,
  getMessages,
  sendMessage,
} from "../controller/directChatController.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/search", searchUsers);
router.get("/threads", getMyThreads);
router.post("/threads", createOrGetThread);
router.get("/threads/:id/messages", getMessages);
router.post("/threads/:id/messages", sendMessage);

export default router;
