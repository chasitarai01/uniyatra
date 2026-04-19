import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/email.js';
import dotenv from 'dotenv';
dotenv.config(); //variables are loaded

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET is not defined in environment variables. Falling back to insecure secret for development.");
}
const ACTUAL_SECRET = JWT_SECRET || 'fallback_secret_uniyatra_2024';

// ... previous methods ...

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ msg: "User with this email does not exist" });

    // Generate Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire (10 mins)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create reset URL
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a put request to: \n\n ${resetUrl}`;

    try {
      await sendEmail(user.email, "Password Reset Request", message);
      res.status(200).json({ msg: "Email sent" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ msg: "Email could not be sent" });
    }
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ msg: "Password is required" });

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    // Set new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ msg: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};
// Register User
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Checking if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        msg: "User already registered. Please login.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  new user
    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      msg: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role || "user",
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ msg: "Server error during registration" });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ msg: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });

    // Sign JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role || 'user' },
      ACTUAL_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || 'user'
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ msg: 'Server error during login' });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password

    if (!users || users.length === 0) {
      return res.status(404).json({ msg: 'No users found' });
    }

    res.status(200).json({
      total: users.length,
      users,
    });
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({ msg: 'Server error while fetching users' });
  }
};