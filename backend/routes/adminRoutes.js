// routes/adminRoutes.js
import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};

// Dashboard statistics route
router.get("/dashboard/stats", protect, adminOnly, getDashboardStats);

export default router;