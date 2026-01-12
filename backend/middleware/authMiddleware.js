import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Protect route & attach user
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and select necessary fields
    let user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "User not found" });

    // ✅ Attach user with departmentId
    req.user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId, // ✅ Important for department users
    };

    console.log("✅ Authenticated user:", req.user);
    next();
  } catch (error) {
    console.error("❌ Auth error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};

// Check if user is department
export const isDepartment = (req, res, next) => {
  if (req.user && (req.user.role === "department" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Department or Admin only." });
  }
};

// Default export for backward compatibility
export default protect;
