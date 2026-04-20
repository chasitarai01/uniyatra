import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getCoursesByUniversityCode,
  updateCourse,
  deleteCourse,
} from "../controller/CourseController.js";

const router = express.Router();

router.post("/", createCourse);
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.get("/university/:code", getCoursesByUniversityCode);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
