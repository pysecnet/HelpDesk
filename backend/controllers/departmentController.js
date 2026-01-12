// controllers/departmentController.js
import Department from "../models/departmentModel.js";
import User from "../models/userModel.js";

/**
 * Helper function to get admin's category based on their departmentId
 */
const getAdminCategory = async (user) => {
  if (!user.departmentId) {
    return "MAIN"; // Main admin sees MAIN category departments
  }
  
  const dept = await Department.findById(user.departmentId);
  if (dept) {
    const deptName = dept.name.toUpperCase();
    if (deptName === "DVM") return "DVM";
    if (deptName === "CPD") return "CPD";
  }
  return "MAIN";
};

/**
 * Get all departments (filtered by admin's category)
 * Route: GET /api/departments
 */
export const getAllDepartments = async (req, res) => {
  try {
    const user = req.user;
    let filter = { isActive: true };

    // Filter by category if admin has a departmentId
    if (user.role === "admin") {
      const category = await getAdminCategory(user);
      filter.category = category;
      console.log(`📁 Fetching ${category} departments for admin`);
    }

    const departments = await Department.find(filter).sort({ name: 1 });

    res.json({
      departments,
      count: departments.length,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({
      message: "Error fetching departments",
      error: error.message,
    });
  }
};

/**
 * Get single department by ID
 * Route: GET /api/departments/:id
 */
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Check if admin has access to this department's category
    if (req.user.role === "admin") {
      const adminCategory = await getAdminCategory(req.user);
      if (department.category !== adminCategory) {
        return res.status(403).json({ message: "Access denied to this department" });
      }
    }

    res.json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({
      message: "Error fetching department",
      error: error.message,
    });
  }
};

/**
 * Create new department
 * Route: POST /api/departments
 */
export const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const user = req.user;

    if (!name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    // Determine category based on admin type
    const category = await getAdminCategory(user);

    // Check if department with same name exists in this category
    const existing = await Department.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      category 
    });
    
    if (existing) {
      return res.status(400).json({ 
        message: `Department "${name}" already exists in ${category} category` 
      });
    }

    const department = await Department.create({
      name,
      description: description || "",
      category,
    });

    console.log(`✅ Created department: ${name} (${category})`);

    res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({
      message: "Error creating department",
      error: error.message,
    });
  }
};

/**
 * Update department
 * Route: PUT /api/departments/:id
 */
export const updateDepartment = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Check if admin has access to this department's category
    if (req.user.role === "admin") {
      const adminCategory = await getAdminCategory(req.user);
      if (department.category !== adminCategory) {
        return res.status(403).json({ message: "Access denied to this department" });
      }
    }

    // Update fields
    if (name) department.name = name;
    if (description !== undefined) department.description = description;
    if (isActive !== undefined) department.isActive = isActive;

    await department.save();

    res.json({
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({
      message: "Error updating department",
      error: error.message,
    });
  }
};

/**
 * Delete department
 * Route: DELETE /api/departments/:id
 */
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Check if admin has access to this department's category
    if (req.user.role === "admin") {
      const adminCategory = await getAdminCategory(req.user);
      if (department.category !== adminCategory) {
        return res.status(403).json({ message: "Access denied to this department" });
      }
    }

    // Soft delete - just mark as inactive
    department.isActive = false;
    await department.save();

    res.json({
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({
      message: "Error deleting department",
      error: error.message,
    });
  }
};
