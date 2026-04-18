import express from 'express';
import { register, login, getAllUsers, forgotPassword, resetPassword } from '../controller/userController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', getAllUsers);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
