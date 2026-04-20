import express from "express";
import {
  createUniversity,
  getScholarshipsByUniversityCode,
  getSingleUniversities,
  getUniversities,
  getUniversityById,
  updateUniversity,
  deleteUniversity,
} from "../controller/Unicontroller.js";

const router = express.Router();

// GET all universities 
router.get("/", getUniversities);

router.post("/", createUniversity);
router.get("/:id", getUniversityById);
router.put("/:id", updateUniversity);
router.get('/:universityCode/scholarships', getScholarshipsByUniversityCode);
router.delete('/:id', deleteUniversity);
export default router;
