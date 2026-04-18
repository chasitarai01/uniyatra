import File from "../model/fileModel.js";
import { v2 as cloudinary } from "cloudinary";

export const addImage = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from middleware

    const imageFiles = req.files.image;  // 'image' is now an array of files
    
    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({ message: "File is required" });
    }
    
    const fileUrls = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const upload = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto"
      });

      fileUrls.push({
        image: upload.secure_url,
        userId: userId // Associate uploaded image with user
      });
    }

    const files = await File.create(fileUrls);
    return res.status(200).json({
      message: "Files uploaded successfully",
      data: files
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get images/files
export const getImage = async (req, res) => {
  try {
    const { filename } = req.query;

    const query = filename
      ? { image: { $regex: filename, $options: "i" } }
      : {};

    // Corrected: space-separated string for fields to populate
    const files = await File.find(query).populate("userId", "email username");

    if (files.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }

    res.status(200).json({ data: files });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get single file
export const getSingleImage = async (req, res) => {
  try {
    const id = req.params.id;
    const file = await File.findById(id);
    
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    
    res.status(200).json({ message: "File fetched successfully", data: file });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete file
export const deleteImage = async (req, res) => {
  try {
    const id = req.params.id;
    const file = await File.findById(id);
    
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    
    // Extract the public_id from the Cloudinary URL to delete the file from Cloudinary
    if (file.image) {
      const publicId = file.image.split('/').slice(-1)[0].split('.')[0];
      // Try to delete from Cloudinary if possible
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }
    
    // Delete from database
    const deletedFile = await File.findByIdAndDelete(id);
    res.status(200).json({ message: "File successfully deleted", data: deletedFile });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};