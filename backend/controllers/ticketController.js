// controllers/ticketController.js
import Ticket from "../models/ticketModel.js";
import Department from "../models/departmentModel.js";
import User from "../models/userModel.js";
import fs from "fs";
import path from "path";

// ========================================
// UTILITY FUNCTIONS
// ========================================

const validateRollNumber = (rollNumber) => {
  if (!rollNumber) {
    return { isValid: false, error: "Roll number is required" };
  }

  const rollPattern = /^2K(\d{2})-([A-Z]+)-(\d+)$/i;
  const match = rollNumber.match(rollPattern);

  if (!match) {
    return {
      isValid: false,
      error: "Invalid roll number format. Expected format: 2KYY-DEPT-N (e.g., 2K21-IT-1, 2K21-DVM-1)",
    };
  }

  const [, yearSuffix, deptCode, studentNum] = match;
  const enrollmentYear = 2000 + parseInt(yearSuffix);
  const currentYear = new Date().getFullYear();
  const studentYear = currentYear - enrollmentYear + 1;

  if (studentYear > 4) {
    return {
      isValid: false,
      error: `This roll number indicates graduation year ${enrollmentYear + 4}. Only currently enrolled students can create tickets.`,
    };
  }

  if (studentYear < 1) {
    return { isValid: false, error: "Invalid enrollment year in roll number" };
  }

  // Updated department mapping with DVM, CPT, CPD
  const deptMapping = {
    IT: "Information Technology",
    CS: "Computer Science",
    SE: "Software Engineering",
    EE: "Electrical Engineering",
    ME: "Mechanical Engineering",
    CE: "Civil Engineering",
    AI: "Artificial Intelligence",
    DS: "Data Science",
    CY: "Cyber Security",
    DVM: "DVM",           // DVM Department
    CPT: "CPD",           // CPT students go to CPD department
    CPD: "CPD",           // CPD students go to CPD department
  };

  return {
    isValid: true,
    data: {
      enrollmentYear,
      studentYear,
      departmentCode: deptCode.toUpperCase(),
      departmentName: deptMapping[deptCode.toUpperCase()] || deptCode,
      studentNumber: studentNum,
    },
  };
};

const extractDepartmentCode = (rollNumber) => {
  const match = rollNumber.match(/^2K\d{2}-([A-Z]+)-\d+$/i);
  return match ? match[1].toUpperCase() : null;
};

// Helper to get target department based on student's department code
const getTargetDepartment = async (deptCode) => {
  // CPT and CPD students go to CPD department
  const targetDeptName = (deptCode === "CPT" || deptCode === "CPD") ? "CPD" : deptCode;
  
  const department = await Department.findOne({
    $or: [
      { name: { $regex: `^${targetDeptName}$`, $options: "i" } },
      { name: { $regex: targetDeptName, $options: "i" } },
      { code: targetDeptName },
    ],
  });
  
  return department;
};

const addHistory = (ticket, action, performedBy, performedByName, performedByRole, description, oldValue = null, newValue = null) => {
  ticket.history.push({
    action,
    performedBy,
    performedByName,
    performedByRole,
    description,
    oldValue,
    newValue,
  });
};

// ========================================
// TICKET CRUD
// ========================================

// Create a new ticket
export const createTicket = async (req, res) => {
  try {
    const { title, category, description, studentEmail, studentPhone, priority } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(403).json({
        message: "Only students can create support tickets",
      });
    }

    if (!user.rollNumber) {
      return res.status(400).json({
        message: "Your account does not have a roll number. Please contact administration.",
      });
    }

    let department = null;
    let validation = null;
    let ticketStatus = "Open";
    let studentDepartmentCode = null;

    validation = validateRollNumber(user.rollNumber);

    if (validation.isValid) {
      const departmentCode = extractDepartmentCode(user.rollNumber);
      studentDepartmentCode = departmentCode;

      // Use helper to get correct target department (handles CPT -> CPD routing)
      department = await getTargetDepartment(departmentCode);

      if (department) {
        ticketStatus = "Assigned";
      }
    }

    const ticketCount = await Ticket.countDocuments();
    const ticketNo = ticketCount + 1001;

    const ticketData = {
      userId,
      createdBy: userId,
      title,
      category,
      description,
      studentEmail: studentEmail || user.email,
      studentPhone: studentPhone || user.phone,
      ticketNo,
      status: ticketStatus,
      studentRollNumber: user.rollNumber,
      priority: priority || "Medium",
    };

    if (department) {
      ticketData.assignedDepartment = department._id;
    }
    if (studentDepartmentCode) {
      ticketData.studentDepartment = studentDepartmentCode;
    }
    if (validation?.isValid) {
      ticketData.studentYear = validation.data.studentYear.toString();
    }

    const ticket = await Ticket.create(ticketData);

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("assignedDepartment", "name")
      .populate("userId", "fullname email rollNumber");

    const responseMessage = department
      ? "Ticket created and assigned successfully"
      : "Ticket created successfully. An admin will assign it to a department.";

    const response = {
      message: responseMessage,
      ticket: populatedTicket,
    };

    if (department) {
      response.assignedTo = department.name;
    }

    if (validation?.isValid) {
      response.studentInfo = {
        rollNumber: user.rollNumber,
        year: validation.data.studentYear,
        department: validation.data.departmentName,
      };
    }

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({
      message: "Error creating ticket",
      error: error.message,
    });
  }
};

// Get tickets for student
export const getMyTickets = async (req, res) => {
  try {
    const userId = req.user._id;

    const tickets = await Ticket.find({ userId })
      .populate("assignedDepartment", "name")
      .sort({ createdAt: -1 });

    res.json({
      tickets,
      count: tickets.length,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({
      message: "Error fetching tickets",
      error: error.message,
    });
  }
};

// Get all tickets (admin)
// Main Admin (no departmentId): sees all tickets
// DVM Admin: sees only DVM student tickets
// CPD Admin: sees only CPT and CPD student tickets
export const getAllTickets = async (req, res) => {
  try {
    const user = req.user;
    let ticketFilter = {};

    // Check if admin has a department filter
    if (user.role === "admin" && user.departmentId) {
      const Department = (await import("../models/departmentModel.js")).default;
      const department = await Department.findById(user.departmentId);
      
      if (department) {
        const deptName = department.name.toUpperCase();
        
        if (deptName === "DVM") {
          ticketFilter.studentDepartment = "DVM";
        } else if (deptName === "CPD") {
          // CPD admin sees both CPT and CPD students
          ticketFilter.studentDepartment = { $in: ["CPT", "CPD"] };
        } else {
          ticketFilter.studentDepartment = deptName;
        }
      }
    }

    const tickets = await Ticket.find(ticketFilter)
      .populate("assignedDepartment", "name")
      .populate("userId", "fullname email rollNumber")
      .sort({ createdAt: -1 });

    res.json({
      tickets,
      count: tickets.length,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({
      message: "Error fetching tickets",
      error: error.message,
    });
  }
};

// Get department tickets
export const getDepartmentTickets = async (req, res) => {
  try {
    const user = req.user;

    if (user.role === "admin") {
      const tickets = await Ticket.find()
        .populate("assignedDepartment", "name")
        .populate("userId", "fullname email rollNumber")
        .sort({ createdAt: -1 });

      return res.json({
        tickets,
        count: tickets.length,
      });
    }

    if (user.role === "department") {
      if (!user.departmentId) {
        return res.status(400).json({
          message: "Your account is not assigned to a department",
        });
      }

      const tickets = await Ticket.find({ assignedDepartment: user.departmentId })
        .populate("assignedDepartment", "name")
        .populate("userId", "fullname email rollNumber")
        .sort({ createdAt: -1 });

      return res.json({
        tickets,
        count: tickets.length,
        department: user.departmentId,
      });
    }

    res.status(403).json({
      message: "Unauthorized access",
    });
  } catch (error) {
    console.error("Error fetching department tickets:", error);
    res.status(500).json({
      message: "Error fetching department tickets",
      error: error.message,
    });
  }
};

// Get single ticket with full details
export const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const user = req.user;

    const ticket = await Ticket.findById(ticketId)
      .populate("assignedDepartment", "name")
      .populate("userId", "fullname email rollNumber")
      .populate("comments.userId", "fullname role")
      .populate("attachments.uploadedBy", "fullname")
      .populate("history.performedBy", "fullname");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check permissions
    if (user.role === "student" && ticket.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (user.role === "department" && ticket.assignedDepartment?.toString() !== user.departmentId?.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({
      message: "Error fetching ticket",
      error: error.message,
    });
  }
};

// Assign ticket to department
export const assignTicketToDepartment = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { departmentId } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only main admin can reassign tickets",
      });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const oldDept = ticket.assignedDepartment;
    ticket.assignedDepartment = departmentId;
    ticket.status = "Assigned";

    // Add history
    addHistory(
      ticket,
      "assigned",
      req.user._id,
      req.user.fullname,
      req.user.role,
      `Ticket assigned to ${department.name}`,
      oldDept ? oldDept.toString() : "None",
      department.name
    );

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticketId)
      .populate("assignedDepartment", "name")
      .populate("userId", "fullname email rollNumber");

    res.json({
      message: "Ticket reassigned successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error assigning ticket:", error);
    res.status(500).json({
      message: "Error assigning ticket",
      error: error.message,
    });
  }
};

// Update ticket status
export const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;
    const user = req.user;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (user.role === "department") {
      if (ticket.assignedDepartment.toString() !== user.departmentId.toString()) {
        return res.status(403).json({
          message: "You can only update tickets assigned to your department",
        });
      }
    } else if (user.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized to update ticket status",
      });
    }

    const validStatuses = ["Open", "Assigned", "In Progress", "Closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        validStatuses,
      });
    }

    const oldStatus = ticket.status;
    ticket.status = status;

    if (status === "Closed") {
      ticket.resolvedAt = new Date();
    }

    // Add history
    addHistory(
      ticket,
      "status_changed",
      user._id,
      user.fullname,
      user.role,
      `Status changed from ${oldStatus} to ${status}`,
      oldStatus,
      status
    );

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticketId)
      .populate("assignedDepartment", "name")
      .populate("userId", "fullname email rollNumber");

    res.json({
      message: "Ticket status updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({
      message: "Error updating ticket status",
      error: error.message,
    });
  }
};

// Update ticket priority
export const updateTicketPriority = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { priority } = req.body;
    const user = req.user;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Only admin and department can change priority
    if (user.role === "student") {
      return res.status(403).json({ message: "Students cannot change ticket priority" });
    }

    const validPriorities = ["Low", "Medium", "High", "Urgent"];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Invalid priority",
        validPriorities,
      });
    }

    const oldPriority = ticket.priority;
    ticket.priority = priority;

    // Add history
    addHistory(
      ticket,
      "priority_changed",
      user._id,
      user.fullname,
      user.role,
      `Priority changed from ${oldPriority} to ${priority}`,
      oldPriority,
      priority
    );

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticketId)
      .populate("assignedDepartment", "name")
      .populate("userId", "fullname email rollNumber");

    res.json({
      message: "Priority updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating priority:", error);
    res.status(500).json({
      message: "Error updating priority",
      error: error.message,
    });
  }
};

// Add comment to ticket
export const addComment = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message, isInternal } = req.body;
    const user = req.user;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Comment message is required" });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check permissions
    if (user.role === "student" && ticket.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "You can only comment on your own tickets" });
    }

    if (user.role === "department" && ticket.assignedDepartment?.toString() !== user.departmentId?.toString()) {
      return res.status(403).json({ message: "You can only comment on tickets assigned to your department" });
    }

    // Add comment
    const comment = {
      userId: user._id,
      userName: user.fullname,
      userRole: user.role,
      message: message.trim(),
      isInternal: isInternal || false,
    };

    ticket.comments.push(comment);

    // Add history
    addHistory(
      ticket,
      "comment_added",
      user._id,
      user.fullname,
      user.role,
      `Added a comment`
    );

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticketId)
      .populate("assignedDepartment", "name")
      .populate("userId", "fullname email rollNumber")
      .populate("comments.userId", "fullname role");

    res.json({
      message: "Comment added successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      message: "Error adding comment",
      error: error.message,
    });
  }
};

// Upload file attachment
export const uploadAttachment = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const user = req.user;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      // Delete uploaded file if ticket not found
      fs.unlinkSync(file.path);
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check permissions
    if (user.role === "student" && ticket.userId.toString() !== user._id.toString()) {
      fs.unlinkSync(file.path);
      return res.status(403).json({ message: "You can only upload files to your own tickets" });
    }

    if (user.role === "department" && ticket.assignedDepartment?.toString() !== user.departmentId?.toString()) {
      fs.unlinkSync(file.path);
      return res.status(403).json({ message: "You can only upload files to tickets assigned to your department" });
    }

    // Add attachment
    const attachment = {
      fileName: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      fileType: file.mimetype,
      uploadedBy: user._id,
      uploadedByName: user.fullname,
    };

    ticket.attachments.push(attachment);

    // Add history
    addHistory(
      ticket,
      "file_uploaded",
      user._id,
      user.fullname,
      user.role,
      `Uploaded file: ${file.originalname}`
    );

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticketId)
      .populate("assignedDepartment", "name")
      .populate("userId", "fullname email rollNumber")
      .populate("attachments.uploadedBy", "fullname");

    res.json({
      message: "File uploaded successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error uploading file:", error);
    res.status(500).json({
      message: "Error uploading file",
      error: error.message,
    });
  }
};

// Download file attachment
export const downloadAttachment = async (req, res) => {
  try {
    const { ticketId, attachmentId } = req.params;
    const user = req.user;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check permissions
    if (user.role === "student" && ticket.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (user.role === "department" && ticket.assignedDepartment?.toString() !== user.departmentId?.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const attachment = ticket.attachments.id(attachmentId);
    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    const filePath = path.resolve(attachment.filePath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(filePath, attachment.originalName);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({
      message: "Error downloading file",
      error: error.message,
    });
  }
};

// Get ticket statistics
export const getTicketStats = async (req, res) => {
  try {
    const user = req.user;
    let query = {};

    if (user.role === "department" && user.departmentId) {
      query.assignedDepartment = user.departmentId;
    }

    const totalTickets = await Ticket.countDocuments(query);
    const openTickets = await Ticket.countDocuments({ ...query, status: "Open" });
    const assignedTickets = await Ticket.countDocuments({ ...query, status: "Assigned" });
    const inProgressTickets = await Ticket.countDocuments({ ...query, status: "In Progress" });
    const closedTickets = await Ticket.countDocuments({ ...query, status: "Closed" });

    const ticketsByDepartment = await Ticket.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$assignedDepartment",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: "$department",
      },
      {
        $project: {
          departmentName: "$department.name",
          count: 1,
        },
      },
    ]);

    res.json({
      stats: {
        total: totalTickets,
        open: openTickets,
        assigned: assignedTickets,
        inProgress: inProgressTickets,
        closed: closedTickets,
      },
      byDepartment: ticketsByDepartment,
    });
  } catch (error) {
    console.error("Error fetching ticket stats:", error);
    res.status(500).json({
      message: "Error fetching ticket statistics",
      error: error.message,
    });
  }
};

export default {
  createTicket,
  getMyTickets,
  getAllTickets,
  getDepartmentTickets,
  getTicketById,
  assignTicketToDepartment,
  updateTicketStatus,
  updateTicketPriority,
  addComment,
  uploadAttachment,
  downloadAttachment,
  getTicketStats,
};