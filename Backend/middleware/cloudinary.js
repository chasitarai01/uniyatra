import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const configureCloudinary = () => {
  try {
    const requiredVars = [
      'CLOUDINARY_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_SECRET_KEY'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });

    console.log("Cloudinary configured successfully!");
    return true;
  } catch (error) {
    console.error("Cloudinary configuration error:", error.message);
    return false;
  }
};

const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary connection verified:", result.status === "ok" ? "Connected" : "Failed");
    return result.status === "ok";
  } catch (error) {
    console.error("Cloudinary connection test failed:", error.message);
    return false;
  }
};

const connectCloudinary = async () => {
  const isConfigured = configureCloudinary();

  if (!isConfigured) {
    throw new Error("Failed to configure Cloudinary");
  }

  const isConnected = await testCloudinaryConnection();

  if (!isConnected) {
    throw new Error("Failed to connect to Cloudinary");
  }

  console.log("✅ Cloudinary connected and ready to use!");
  return true;
};

const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const isConfigured = configureCloudinary();
    if (!isConfigured) {
      throw new Error("Cloudinary not configured");
    }

    const uploadOptions = {
      folder: options.folder || "documents",
      resource_type: options.resource_type || "auto",
      ...options
    };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      created_at: result.created_at
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

export {
  cloudinary,
  connectCloudinary,
  uploadToCloudinary
};