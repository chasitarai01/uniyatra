import User from "../model/userModel.js";
import jwt from "jsonwebtoken";

// ── isAuthenticated / protect ─────────────────────────────────────────────────
export const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  const tokenWithoutBearer = token.startsWith("Bearer ")
    ? token.slice(7)
    : token;

  try {
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const userData = await User.findById(decoded.userId);

    if (!userData) {
      return res.status(404).json({
        message: "No user associated with this token",
      });
    }

    req.user = userData;  // full Mongoose doc → use req.user._id, req.user.role
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};

// Alias so roomRoutes.js can import either name
export const protect = isAuthenticated;

// ── adminOnly ─────────────────────────────────────────────────────────────────
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  next();
};