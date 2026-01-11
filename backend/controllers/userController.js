import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Generate JWT Token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Helper function to extract department from roll number
const getDepartmentFromRollNumber = (rollNumber) => {
  const match = rollNumber.match(/2k\d{2}-(CS|IT|EE|ME|CE)-\d+/i);
  if (match) {
    return match[1].toUpperCase(); // Returns: IT, CS, EE, ME, CE
  }
  return null;
};

// =====================
// Register User
// =====================
export const registerUser = async (req, res) => {
  try {
    console.log("📝 Request body:", req.body);

    const {
      fullname,
      email,
      password,
      rollNumber,
      gender,
      dob,
      address,
      phone,
      role = "student",
      departmentId = null,
    } = req.body;

    // Check required fields for students
    if (role === "student") {
      if (!fullname || !email || !password || !rollNumber || !gender || !dob || !address || !phone) {
        return res.status(400).json({ 
          message: "All fields are required for student registration: fullname, email, password, rollNumber, gender, dob, address, phone" 
        });
      }

      // Validate roll number format
      const rollNumberRegex = /^2k\d{2}-(CS|IT|EE|ME|CE)-\d+$/i;
      if (!rollNumberRegex.test(rollNumber)) {
        return res.status(400).json({ 
          message: "Invalid roll number format. Use format like: 2K26-IT-1, 2K23-CS-15, etc." 
        });
      }

      // Check if roll number already exists
      const existingRollNumber = await User.findOne({ 
        rollNumber: rollNumber.toUpperCase() 
      });
      if (existingRollNumber) {
        return res.status(400).json({ 
          message: "This roll number is already registered" 
        });
      }
    } else if (role === "department") {
      // Department users need departmentId
      if (!fullname || !email || !password || !departmentId) {
        return res.status(400).json({ 
          message: "Department registration requires: fullname, email, password, departmentId" 
        });
      }
    } else {
      // Admin or other roles
      if (!fullname || !email || !password) {
        return res.status(400).json({ 
          message: "Please provide fullname, email, and password" 
        });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Validate phone format
    const phoneRegex = /^0\d{3}-\d{7}$/;
    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({ 
        message: "Invalid phone format. Use: 0316-3280715" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const userData = {
      fullname,
      email,
      password: hashedPassword,
      gender: gender || "Other",
      role,
    };

    // Add student-specific fields
    if (role === "student") {
      userData.rollNumber = rollNumber.toUpperCase();
      userData.dob = new Date(dob);
      userData.address = address;
      userData.phone = phone;
    }

    // Add department-specific fields
    if (role === "department") {
      userData.departmentId = departmentId;
      if (gender) userData.gender = gender;
      if (dob) userData.dob = new Date(dob);
      if (address) userData.address = address;
      if (phone) userData.phone = phone;
    }

    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id);

    // Extract department info from roll number for response
    const department = role === "student" ? getDepartmentFromRollNumber(rollNumber) : null;

    // Send response
    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber || null,
        department: department,
        departmentId: user.departmentId || null,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      if (error.keyPattern?.rollNumber) {
        return res.status(400).json({ message: "Roll number already exists" });
      }
      return res.status(400).json({ message: "Email already exists" });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =====================
// Login User
// =====================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: "Please provide email and password" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    // Extract department from roll number for students
    const department = user.role === "student" && user.rollNumber 
      ? getDepartmentFromRollNumber(user.rollNumber) 
      : null;

    res.status(200).json({
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber || null,
        department: department,
        departmentId: user.departmentId || null,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =====================
// Get User Profile
// =====================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract department from roll number for students
    const department = user.role === "student" && user.rollNumber 
      ? getDepartmentFromRollNumber(user.rollNumber) 
      : null;

    res.status(200).json({ 
      user: {
        ...user.toObject(),
        department: department
      }
    });
  } catch (error) {
    console.error("❌ Get Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =====================
// Get All Departments (Admin only)
// =====================
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await User.find({ role: "department" }).select(
      "fullname email departmentId"
    );
    if (!departments.length) {
      return res.status(404).json({ message: "No departments found" });
    }

    res.status(200).json({ departments });
  } catch (error) {
    console.error("❌ Get Departments Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
