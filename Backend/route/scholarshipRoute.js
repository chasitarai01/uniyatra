import express from "express";
import {
  createScholarship,
  getAllScholarships,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
  getScholarshipsByUniversity,
} from "../controller/scholarshipController.js";

const router = express.Router();

// ✅ Routes
router.post("/", createScholarship);
router.get("/", getAllScholarships);
router.get("/:id", getScholarshipById);
router.get("/university/:id", getScholarshipsByUniversity);
router.put("/:id", updateScholarship);
router.delete("/:id", deleteScholarship);

export default router;
