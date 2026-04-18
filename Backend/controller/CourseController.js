import Course from "../model/CourseModel.js";
import University from "../model/UniModel.js";

/* =====================================================
   CREATE COURSE
   ===================================================== */
export const createCourse = async (req, res) => {
  try {
    const {
      CourseName,
      UniversityCode,
      Country,
      Overview,
      Faculty,
      Level,
      Mode,
      StartDate,
      Duration,
      TuitionFee,
      TotalFee,
    } = req.body;

    if (!CourseName || !UniversityCode) {
      return res.status(400).json({
        success: false,
        message: "CourseName and UniversityCode are required",
      });
    }

    // Check university exists
    const uni = await University.findOne({ UniversityCode });
    if (!uni) {
      return res.status(404).json({
        success: false,
        message: "University not found for this UniversityCode",
      });
    }

    const course = await Course.create({
      CourseName,
      UniversityCode,
      Country,
      Overview,
      Faculty,
      Level,
      Mode,
      StartDate,
      Duration,
      TuitionFee,
      TotalFee,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =====================================================
   GET ALL COURSES
   ===================================================== */
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ CourseName: 1 });

    res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Get all courses error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =====================================================
   GET COURSE BY ID
   ===================================================== */
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course retrieved successfully",
      data: course,
    });
  } catch (error) {
    console.error("Get course by id error:", error);
    res.status(500).json({
      success: false,
      message: "Invalid course ID",
    });
  }
};

/* =====================================================
   GET COURSES BY UNIVERSITY CODE
   ===================================================== */
export const getCoursesByUniversityCode = async (req, res) => {
  try {
    const { code } = req.params;

    const uni = await University.findOne({ UniversityCode: code });
    if (!uni) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    const courses = await Course.find({ UniversityCode: code })
      .sort({ CourseName: 1 });

    res.status(200).json({
      success: true,
      message: `Courses for ${uni.University} retrieved successfully`,
      data: courses,
    });
  } catch (error) {
    console.error("Get courses by university code error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =====================================================
   UPDATE COURSE
   ===================================================== */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({
      success: false,
      message: "Invalid update data",
    });
  }
};

/* =====================================================
   DELETE COURSE
   ===================================================== */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({
      success: false,
      message: "Invalid course ID",
    });
  }
};
