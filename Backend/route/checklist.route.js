import express from 'express';
import {
  createChecklists,
  // getUserChecklists,
  toggleChecklistItem,
  markChecklistComplete,
  deleteChecklist,
  // getUserChecklists,
  getAllChecklists
} from '../controller/checklist.controller.js';

import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected Routes
router.post('/create', isAuthenticated, createChecklists);
// router.get('/user/:userId', isAuthenticated, getUserChecklists);
router.patch('/:checklistId/toggle', isAuthenticated, toggleChecklistItem);
router.patch('/:id/complete', isAuthenticated, markChecklistComplete);
router.delete('/:checklistId', deleteChecklist); 
router.get('/public/all', getAllChecklists);
export default router;