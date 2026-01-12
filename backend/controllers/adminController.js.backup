// controllers/adminController.js
import Ticket from "../models/ticketModel.js";
import User from "../models/userModel.js";
import Department from "../models/departmentModel.js";

/**
 * Get dashboard statistics for admin
 * Route: GET /api/admin/dashboard/stats
 * 
 * - Main Admin (no departmentId): sees all tickets
 * - DVM Admin (departmentId = DVM): sees only DVM student tickets
 * - CPD Admin (departmentId = CPD): sees only CPT and CPD student tickets
 */
export const getDashboardStats = async (req, res) => {
  try {
    console.log("📊 Fetching dashboard stats...");
    console.log("User:", req.user);

    // Build query filter based on admin type
    let ticketFilter = {};
    
    // Check if admin has a department filter
    if (req.user.departmentId) {
      // Get department name
      const department = await Department.findById(req.user.departmentId);
      if (department) {
        const deptName = department.name.toUpperCase();
        console.log(`🔍 Filtering for department: ${deptName}`);
        
        // Filter tickets by student department
        if (deptName === "DVM") {
          ticketFilter.studentDepartment = "DVM";
        } else if (deptName === "CPD") {
          // CPD admin sees both CPT and CPD students
          ticketFilter.studentDepartment = { $in: ["CPT", "CPD"] };
        } else {
          // Other department admins see their department's tickets
          ticketFilter.studentDepartment = deptName;
        }
      }
    }

    console.log("Ticket filter:", ticketFilter);

    // Count tickets with filter
    const totalTickets = await Ticket.countDocuments(ticketFilter);
    console.log(`Total Tickets: ${totalTickets}`);

    // Count by status with filter
    const openTickets = await Ticket.countDocuments({ ...ticketFilter, status: "Open" });
    const assignedTickets = await Ticket.countDocuments({ ...ticketFilter, status: "Assigned" });
    const inProgressTickets = await Ticket.countDocuments({ ...ticketFilter, status: "In Progress" });
    const closedTickets = await Ticket.countDocuments({ ...ticketFilter, status: "Closed" });

    console.log(`Open: ${openTickets}, Assigned: ${assignedTickets}, In Progress: ${inProgressTickets}, Closed: ${closedTickets}`);

    // Count departments and students
    const totalDepartments = await Department.countDocuments();
    
    // Count students based on admin type
    let studentFilter = { role: "student" };
    if (req.user.departmentId) {
      const department = await Department.findById(req.user.departmentId);
      if (department) {
        const deptName = department.name.toUpperCase();
        if (deptName === "DVM") {
          studentFilter.rollNumber = { $regex: /^2K\d{2}-DVM-/i };
        } else if (deptName === "CPD") {
          studentFilter.rollNumber = { $regex: /^2K\d{2}-(CPT|CPD)-/i };
        }
      }
    }
    const totalStudents = await User.countDocuments(studentFilter);

    console.log(`Departments: ${totalDepartments}, Students: ${totalStudents}`);

    // Calculate average response time
    const recentTickets = await Ticket.find({ 
      ...ticketFilter,
      status: { $in: ["Assigned", "In Progress", "Closed"] } 
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("createdAt updatedAt");

    let avgResponseTime = "N/A";
    if (recentTickets.length > 0) {
      const responseTimes = recentTickets
        .filter(ticket => ticket.updatedAt && ticket.createdAt)
        .map(ticket => {
          const diff = new Date(ticket.updatedAt) - new Date(ticket.createdAt);
          return diff / (1000 * 60 * 60); // Hours
        });

      if (responseTimes.length > 0) {
        const avgHours = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        
        if (avgHours < 1) {
          avgResponseTime = `${Math.round(avgHours * 60)}m`;
        } else if (avgHours < 24) {
          avgResponseTime = `${avgHours.toFixed(1)}h`;
        } else {
          const days = Math.floor(avgHours / 24);
          const hours = Math.round(avgHours % 24);
          avgResponseTime = hours > 0 ? `${days}d ${hours}h` : `${days}d`;
        }
      }
    }

    // Response data
    const stats = {
      totalTickets,
      openTickets,
      inProgressTickets: assignedTickets + inProgressTickets, // Combined
      resolvedTickets: closedTickets,
      totalDepartments,
      totalStudents,
      responseTime: avgResponseTime,
    };

    console.log("✅ Dashboard stats fetched successfully:", stats);

    res.status(200).json(stats);

  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    res.status(500).json({
      message: "Error fetching dashboard statistics",
      error: error.message,
    });
  }
};

/**
 * Get all tickets for admin (with optional department filter)
 * Route: GET /api/admin/tickets
 */
export const getAdminTickets = async (req, res) => {
  try {
    let ticketFilter = {};
    
    // Check if admin has a department filter
    if (req.user.departmentId) {
      const department = await Department.findById(req.user.departmentId);
      if (department) {
        const deptName = department.name.toUpperCase();
        
        if (deptName === "DVM") {
          ticketFilter.studentDepartment = "DVM";
        } else if (deptName === "CPD") {
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
    console.error("❌ Error fetching admin tickets:", error);
    res.status(500).json({
      message: "Error fetching tickets",
      error: error.message,
    });
  }
};

export default { getDashboardStats, getAdminTickets };