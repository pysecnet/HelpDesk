import express from "express";
import Department from "../models/departmentModel.js";
import protect from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all departments (publicly accessible for signup)
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json({ departments });
  } catch (err) {
    console.error("❌ Get Departments Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Add new department
router.post("/add", protect, adminOnly, async (req, res) => {
  try {
    console.log("📝 Add Department Request Body:", req.body);
    
    const { name } = req.body;
    
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    // Check if department already exists
    const exists = await Department.findOne({ name: name.trim() });
    if (exists) {
      return res.status(400).json({ message: "Department already exists" });
    }

    // Create new department
    const newDept = new Department({ name: name.trim() });
    await newDept.save();
    
    console.log("✅ Department created:", newDept);
    res.status(201).json({ 
      message: "Department added successfully",
      department: newDept 
    });
  } catch (err) {
    console.error("❌ Add Department Error:", err);
    
    // Handle MongoDB duplicate key error specifically
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "Department already exists or duplicate key error",
        error: err.message 
      });
    }
    
    res.status(500).json({ 
      message: "Server Error", 
      error: err.message 
    });
  }
});

// Delete department
router.delete("/delete/:id", protect, adminOnly, async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    
    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Department Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

export default router;
