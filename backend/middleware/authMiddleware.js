import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Protect route & attach user
const protect = async (req, res, next) => {
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

export default protect;
