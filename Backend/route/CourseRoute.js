import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getCoursesByUniversityCode,
} from "../controller/CourseController.js";

const router = express.Router();

router.post("/", createCourse);
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.get("/university/:code", getCoursesByUniversityCode);

export default router;
