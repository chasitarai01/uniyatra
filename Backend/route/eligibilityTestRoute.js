import express from "express";
import { takeEligibilityTest, getTestHistory } from "../controller/eligibilityTestController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect both routes
router.post("/test", isAuthenticated, takeEligibilityTest);
router.get("/test", isAuthenticated, getTestHistory);

export default router;