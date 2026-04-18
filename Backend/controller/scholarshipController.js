import Scholarship from "../model/Scholarship.js";

// Create Scholarship
export const createScholarship = async (req, res) => {
  try {
    const scholarship = new Scholarship(req.body);
    await scholarship.save();

    res.status(201).json({
      success: true,
      message: "Scholarship added successfully",
      scholarship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add scholarship",
      error: error.message,
    }); // <-- fixed missing closing brace
  }
};

// Get All Scholarships
export const getAllScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: scholarships.length,
      scholarships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch scholarships",
      error: error.message,
    });
  }
};

// Get Scholarship by ID
export const getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: "Scholarship not found",
      });
    }

    res.status(200).json({
      success: true,
      scholarship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch scholarship",
      error: error.message,
    });
  }
};

// Update Scholarship
export const updateScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: "Scholarship not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Scholarship updated successfully",
      scholarship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update scholarship",
      error: error.message,
    });
  }
};

// Get Scholarships by University
export const getScholarshipsByUniversity = async (req, res) => {
  try {
    const { id } = req.params;

    const scholarships = await Scholarship.find({ university: id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: `Scholarships for university ${id} retrieved successfully`,
      count: scholarships.length,
      scholarships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch scholarships by university",
      error: error.message,
    });
  }
};

// Delete Scholarship
export const deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndDelete(req.params.id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: "Scholarship not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Scholarship deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete scholarship",
      error: error.message,
    });
  }
};
