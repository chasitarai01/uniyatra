import University from "../model/UniModel.js";


export const createUniversity = async (req, res) => {
  try {
    const uni = await University.create(req.body);

    res.status(201).json({
      success: true,
      message: "University created successfully",
      data: uni,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create university",
      error: error.message,
    });
  }
};


export const getUniversities = async (req, res) => {
  try {
    const universities = await University.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: universities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch universities",
      error: error.message,
    });
  }
};


export const getUniversityById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by ObjectId first
    const uni = await University.findById(id);
    
    if (!uni) {
      // If not found by ObjectId, try to find by UniversityCode
      const uniByCode = await University.findOne({ UniversityCode: id });
      
      if (!uniByCode) {
        return res.status(404).json({
          success: false,
          message: "University not found",
        });
      }
      
      return res.status(200).json({
        success: true,
        data: uniByCode,
      });
    }

    res.status(200).json({
      success: true,
      data: uni,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch university",
      error: error.message,
    });
  }
};


export const updateUniversity = async (req, res) => {
  try {
    const uni = await University.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated document
    );

    if (!uni) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "University updated successfully",
      data: uni,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update university",
      error: error.message,
    });
  }
};


export const getSingleUniversities = async (req, res) => {
  try {
      const {id} = req.params;
      const universities = await University.findById(id);
      res.status(200).json({ message: 'Universities fetched successfully', data: universities });
  } catch (error) {
      console.error('Error fetching universities:', error.message);
      res.status(500).json({ message: 'Error fetching universities', error: error.message });
  }
};


//Get universityCode as per course parameter

// Get courses by university
export const getCoursesByUniversity = async (req, res) => {
  try {
    const { universityCode } = req.params;
    
    // First check if university exists
    const university = await University.findOne({ UniversityCode: universityCode });
    if (!university) {
      return res.status(404).json({ 
        message: `University with code ${universityCode} not found` 
      });
    }
    
    // Return the courses from the university
    res.status(200).json({
      success: true,
      message: 'Courses fetched successfully',
      data: university.Courses || []
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch courses',
      error: error.message 
    });
  }
};

//Get scholarship with Uni code
export const getScholarshipsByUniversityCode = async (req, res) => {
  try {
      const { universityCode } = req.params;
      
      // First check if university exists
      const university = await University.findOne({ UniversityCode: universityCode });
      if (!university) {
          return res.status(404).json({ 
              message: `University with code ${universityCode} not found` 
          });
      }
      
      // Then find scholarships
      const scholarships = await Scholarship.find({ University: universityCode });
      
      res.status(200).json(scholarships);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Get university by UniversityCode
export const getUniversityByCode = async (req, res) => {
    try {
        const { universityCode } = req.params;
        const university = await University.findOne({ UniversityCode: universityCode });

        if (!university) {
            return res.status(404).json({ message: 'University not found' });
        }

        res.status(200).json({ message: 'University fetched successfully', data: university });
    } catch (error) {
        console.error('Error fetching university:', error.message);
        res.status(500).json({ message: 'Error fetching university', error: error.message });
    }
};

// Update university details

/// Delete university by UniversityCode
export const deleteUniversity = async (req, res) => {
    try {
        const universityCode = req.params.universityCode || req.params.id;

        // Ensure universityCode exists
        if (!universityCode) {
            return res.status(400).json({ message: 'University code is required' });
        }

        // Check if the university exists before deletion
        const existingUniversity = await University.findOne({ UniversityCode: universityCode });

        if (!existingUniversity) {
            return res.status(404).json({ message: 'University not found' });
        }

        // Delete the university
        const deletedUniversity = await University.findOneAndDelete({ UniversityCode: universityCode });

        res.status(200).json({
            message: 'University deleted successfully',
            data: deletedUniversity
        });

    } catch (error) {
        console.error('Error deleting university:', error.message);
        res.status(500).json({ message: 'Error deleting university', error: error.message });
    }
};