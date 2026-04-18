import mongoose from 'mongoose';
import Favorite from '../model/Favorite.js';
import University from '../model/UniModel.js'; 
// import CourseFavorite from '../models/CourseFavorite.js';

// Add a university to user's favorites
export const addFavorite = async (req, res) => {
  const { universityId } = req.body;
  const userId = req.user._id;

  console.log("User ID:", userId);
  console.log("University ID:", universityId);

  try {

    if (!universityId || !mongoose.Types.ObjectId.isValid(universityId)) {
      return res.status(400).json({ message: "Invalid university ID format" });
    }

    const university = await University.findById(universityId);

    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    const existingFavorite = await Favorite.findOne({
      userId,
      universityId
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "Already in favorites" });
    }

    const newFavorite = new Favorite({
      userId,
      universityId
    });

    await newFavorite.save();

    res.status(201).json({
      message: "Added to favorites",
      favorite: newFavorite
    });

  } catch (err) {
    res.status(500).json({
      message: "Error adding to favorites",
      error: err.message
    });
  }
};

// export const addCourseFavorite = async (req, res) => {
//   const { courseId } = req.body;  // match the key sent from frontend
//   const userId = req.user.id;
  
//   console.log("User ID:", userId);
//   console.log("Course ID:", courseId);

//   try {
//     // Validate ObjectId format
//     if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
//       return res.status(400).json({ message: 'Invalid course ID format' });
//     }

//     // Check if the course exists and if it's already in the user's favorites
//     const existingFavorite = await CourseFavorite.findOne({
//       userId,
//       courseId: mongoose.Types.ObjectId(courseId),
//     });

//     if (existingFavorite) {
//       return res.status(400).json({ message: 'Course is already in your favorites' });
//     }

//     // Find the course by ID
//     const course = await Course.findById(courseId);

//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     // Create and save the new course favorite
//     const newFavorite = new CourseFavorite({
//       userId,
//       courseId: course._id,
//     });

//     await newFavorite.save();

//     // Send response with favorite details
//     res.status(201).json({
//       message: 'Course added to favorites',
//       favorite: {
//         userId,
//         courseId: course._id,
//         courseName: course.name,  // Example: Add the course's name to the response
//       },
//     });
//   } catch (err) {
//     console.error("Error adding course favorite:", err);
//     res.status(500).json({ message: 'Error adding course to favorites', error: err.message });
//   }
// };

// Remove a university from user's favorites
export const removeFavorite = async (req, res) => {
  const { universityId } = req.body;
  const userId = req.user._id;

  try {

    const deleted = await Favorite.findOneAndDelete({
      userId,
      universityId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(200).json({ message: "Removed from favorites" });

  } catch (err) {
    res.status(500).json({
      message: "Error removing favorite",
      error: err.message
    });
  }
};
// Get all favorites for a user
export const getFavorites = async (req, res) => {
  const userId = req.user.id; // Get user ID from authenticated request

  try {
    // Find all favorites for the user and populate university details
    const favorites = await Favorite.find({ userId }).populate('universityId');

    if (favorites.length === 0) {
      return res.status(404).json({ message: 'No favorites found for this user' });
    }

    res.status(200).json({ message: 'Favorites fetched successfully', data: favorites });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching favorites', error: err.message });
  }
};

export const getAllFavorites = async (req, res) => {
  try {
    // Fetch all favorite records, with both user and university populated
    const favorites = await Favorite.find()
      .populate('universityId')
      .populate('userId'); // optional: if you want user info too

    res.status(200).json({
      message: 'All favorites fetched successfully',
      data: favorites,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching all favorites',
      error: err.message,
    });
  }
};