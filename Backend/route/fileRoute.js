import { Router } from "express";
import express from 'express';
import upload from "../middleware/multer.js";
import { addImage, deleteImage, getImage, getSingleImage } from "../controller/fileController.js";
import { isAuthenticated } from './../middleware/authMiddleware.js';

const router = express.Router();

// Upload files (multipart/form-data with 'image' as field name)
router.post('/', isAuthenticated, upload.fields([{ name: 'image', maxCount: 10 }]), addImage);

// Get all files uploaded by user (with optional filename filter)
router.get('/', getImage);

// Get a specific file by ID
router.get('/:id', isAuthenticated, getSingleImage);

// Delete a specific file by ID
router.delete('/:id', deleteImage);

export default router;