import express from 'express';
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  getAllFavorites,
} from '../controller/Favorite.js';

import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();



// Remove a favorite

router.post('/', isAuthenticated, addFavorite);
router.delete('/', isAuthenticated, removeFavorite);
router.get('/', isAuthenticated, getFavorites);

// Get all favorites (admin)
router.get('/all', getAllFavorites);


export default router;