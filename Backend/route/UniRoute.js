import express from "express";
import {
  createUniversity,
  getScholarshipsByUniversityCode,
  getSingleUniversities,
  getUniversities,
  getUniversityById,
  updateUniversity,
} from "../controller/Unicontroller.js";

const router = express.Router();

// GET all universities 
router.get("/", getUniversities);

router.post("/", createUniversity);
router.get("/:id", getUniversityById);
router.put("/:id", updateUniversity);
router.get('/:universityCode/scholarships', getScholarshipsByUniversityCode);
export default router;
