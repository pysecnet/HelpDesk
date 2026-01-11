// routes/ticketRoutes.js
import express from "express";
import {
  createTicket,
  getMyTickets,
  getAllTickets,
  assignTicketToDepartment,
  updateTicketStatus,
  getDepartmentTickets,
  getTicketStats,
  getTicketById,          // ✅ NEW
  updateTicketPriority,   // ✅ NEW
  addComment,             // ✅ NEW
  uploadAttachment,       // ✅ NEW
  downloadAttachment,     // ✅ NEW
} from "../controllers/ticketController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // ✅ NEW

const router = express.Router();

// ------------------------------
// Student Routes
// ------------------------------

// Create ticket (student only)
router.post("/", protect, createTicket);

// Get logged-in student's tickets
router.get("/my", protect, getMyTickets);

// ------------------------------
// Admin Routes
// ------------------------------

// Get all tickets (admin only)
router.get("/all", protect, getAllTickets);

// Assign ticket to department (admin only)
router.put("/:ticketId/assign", protect, assignTicketToDepartment);

// Update ticket status (admin or department admin)
router.put("/:ticketId/status", protect, updateTicketStatus);

// Get ticket statistics (admin or department admin)
router.get("/stats", protect, getTicketStats);

// ------------------------------
// Department Routes
// ------------------------------

// Get tickets assigned to this department (department admin)
router.get("/department", protect, getDepartmentTickets);

// ------------------------------
// ✅ NEW: Shared Routes (All authenticated users)
// ------------------------------

// Get single ticket details with full info
router.get("/:ticketId", protect, getTicketById);

// Update ticket priority (admin or department)
router.put("/:ticketId/priority", protect, updateTicketPriority);

// Add comment to ticket
router.post("/:ticketId/comments", protect, addComment);

// Upload file attachment (with multer middleware)
router.post("/:ticketId/attachments", protect, upload.single("file"), uploadAttachment);

// Download file attachment
router.get("/:ticketId/attachments/:attachmentId/download", protect, downloadAttachment);

export default router;