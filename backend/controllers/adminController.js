// controllers/adminController.js
import Ticket from "../models/ticketModel.js";
import User from "../models/userModel.js";
import Department from "../models/departmentModel.js";

/**
 * Get dashboard statistics for admin
 * Route: GET /api/admin/dashboard/stats
 */
export const getDashboardStats = async (req, res) => {
  try {
    console.log("📊 Fetching dashboard stats...");

    // Count all tickets
    const totalTickets = await Ticket.countDocuments();
    console.log(`Total Tickets: ${totalTickets}`);

    // Count by status
    const openTickets = await Ticket.countDocuments({ status: "Open" });
    const assignedTickets = await Ticket.countDocuments({ status: "Assigned" });
    const inProgressTickets = await Ticket.countDocuments({ status: "In Progress" });
    const closedTickets = await Ticket.countDocuments({ status: "Closed" });

    console.log(`Open: ${openTickets}, Assigned: ${assignedTickets}, In Progress: ${inProgressTickets}, Closed: ${closedTickets}`);

    // Count departments and students
    const totalDepartments = await Department.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });

    console.log(`Departments: ${totalDepartments}, Students: ${totalStudents}`);

    // Calculate average response time
    const recentTickets = await Ticket.find({ 
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

export default { getDashboardStats };