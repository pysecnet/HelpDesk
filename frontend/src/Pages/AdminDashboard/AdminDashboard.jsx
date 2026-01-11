import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./AdminDashboard.module.css";
import Ticket from "../../Componenets/Ticket/Ticket";
import DepartmentSection from "../../Componenets/DepartmentSection/DepartmentSection";
import UpdateDatabase from "../../Componenets/UpdateDatabase/UpdateDatabase";
import SupportTicket from "../../Componenets/SupportTicket/SupportTicket";


export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const user = useSelector((state) => state.user.user);

  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    totalDepartments: 0,
    totalStudents: 0,
    databaseEntries: 0,
    responseTime: "2.5h",
  });

  const [loading, setLoading] = useState(true);

  // Fetch dashboard statistics from backend
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        
        // Get auth token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No auth token found');
          setLoading(false);
          return;
        }
        
        console.log('Fetching dashboard stats...');
        
        const response = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.message || 'Failed to fetch dashboard statistics');
        }

        const data = await response.json();
        console.log('Dashboard stats received:', data);
        
        setStats({
          totalTickets: data.totalTickets || 0,
          openTickets: data.openTickets || 0,
          inProgressTickets: data.inProgressTickets || 0,
          resolvedTickets: data.resolvedTickets || 0,
          totalDepartments: data.totalDepartments || 0,
          totalStudents: data.totalStudents || 0,
          databaseEntries: data.databaseEntries || 0,
          responseTime: data.responseTime || "N/A",
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error.message);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
    
    // Optional: Refresh stats every 30 seconds
    const intervalId = setInterval(fetchDashboardStats, 30000);
    
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminContainer}>
        {/* Admin Header */}
        <div className={styles.adminHeader}>
          <div className={styles.headerContent}>
            <div className={styles.welcomeSection}>
              <div className={styles.adminBadge}>
                <i className="bi bi-shield-check"></i>
              </div>
              <div className={styles.welcomeText}>
                <h1 className={styles.welcomeTitle}>
                  Admin Dashboard
                </h1>
                <p className={styles.welcomeSubtitle}>
                  Welcome back, <span className={styles.adminName}>{user?.fullname || "Administrator"}</span>
                </p>
              </div>
            </div>
            <div className={styles.headerStats}>
              <div className={styles.quickStat}>
                <i className="bi bi-ticket-perforated"></i>
                <div>
                  <span className={styles.quickStatValue}>
                    {loading ? "..." : stats.openTickets}
                  </span>
                  <span className={styles.quickStatLabel}>Open</span>
                </div>
              </div>
              <div className={styles.quickStat}>
                <i className="bi bi-clock-history"></i>
                <div>
                  <span className={styles.quickStatValue}>
                    {loading ? "..." : stats.responseTime}
                  </span>
                  <span className={styles.quickStatLabel}>Avg Response</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statPrimary}`}>
            <div className={styles.statIcon}>
              <i className="bi bi-ticket-detailed"></i>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>
                {loading ? "..." : stats.totalTickets}
              </h3>
              <p className={styles.statLabel}>Total Tickets</p>
              <div className={styles.statTrend}>
                <i className="bi bi-arrow-up"></i>
                <span>12% from last month</span>
              </div>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.statWarning}`}>
            <div className={styles.statIcon}>
              <i className="bi bi-hourglass-split"></i>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>
                {loading ? "..." : stats.inProgressTickets}
              </h3>
              <p className={styles.statLabel}>In Progress</p>
              <div className={styles.statTrend}>
                <i className="bi bi-arrow-right"></i>
                <span>Being processed</span>
              </div>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.statSuccess}`}>
            <div className={styles.statIcon}>
              <i className="bi bi-check-circle"></i>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>
                {loading ? "..." : stats.resolvedTickets}
              </h3>
              <p className={styles.statLabel}>Resolved</p>
              <div className={styles.statTrend}>
                <i className="bi bi-arrow-up"></i>
                <span>85% resolution rate</span>
              </div>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.statInfo}`}>
            <div className={styles.statIcon}>
              <i className="bi bi-people"></i>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>
                {loading ? "..." : stats.totalStudents}
              </h3>
              <p className={styles.statLabel}>Active Students</p>
              <div className={styles.statTrend}>
                <i className="bi bi-arrow-up"></i>
                <span>8% growth</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tab} ${
              activeSection === "overview" ? styles.tabActive : ""
            }`}
            onClick={() => setActiveSection("overview")}
          >
            <i className="bi bi-grid"></i>
            <span>Overview</span>
          </button>
          <button
            className={`${styles.tab} ${
              activeSection === "tickets" ? styles.tabActive : ""
            }`}
            onClick={() => setActiveSection("tickets")}
          >
            <i className="bi bi-ticket-perforated"></i>
            <span>Support Tickets</span>
          </button>
          <button
            className={`${styles.tab} ${
              activeSection === "departments" ? styles.tabActive : ""
            }`}
            onClick={() => setActiveSection("departments")}
          >
            <i className="bi bi-building"></i>
            <span>Departments</span>
          </button>
          <button
            className={`${styles.tab} ${
              activeSection === "database" ? styles.tabActive : ""
            }`}
            onClick={() => setActiveSection("database")}
          >
            <i className="bi bi-database"></i>
            <span>AI Database</span>
          </button>
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className={styles.overviewSection}>
              <div className={styles.overviewGrid}>
                {/* Quick Actions Card */}
                <div className={styles.quickActionsCard}>
                  <h3 className={styles.cardTitle}>
                    <i className="bi bi-lightning"></i>
                    Quick Actions
                  </h3>
                  <div className={styles.actionsList}>
                    <button
                      className={styles.actionItem}
                      onClick={() => setActiveSection("tickets")}
                    >
                      <div className={styles.actionIcon}>
                        <i className="bi bi-ticket"></i>
                      </div>
                      <div className={styles.actionContent}>
                        <h4>Manage Tickets</h4>
                        <p>View and assign support tickets</p>
                      </div>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                    
                    <button
                      className={styles.actionItem}
                      onClick={() => setActiveSection("departments")}
                    >
                      <div className={styles.actionIcon}>
                        <i className="bi bi-building"></i>
                      </div>
                      <div className={styles.actionContent}>
                        <h4>Manage Departments</h4>
                        <p>Add or modify departments</p>
                      </div>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                    
                    <button
                      className={styles.actionItem}
                      onClick={() => setActiveSection("database")}
                    >
                      <div className={styles.actionIcon}>
                        <i className="bi bi-database-add"></i>
                      </div>
                      <div className={styles.actionContent}>
                        <h4>Update AI Database</h4>
                        <p>Manage knowledge base entries</p>
                      </div>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>

                {/* Recent Activity Card */}
                <div className={styles.activityCard}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>
                      <i className="bi bi-clock-history"></i>
                      Recent Activity
                    </h3>
                  </div>
                  <div className={styles.activityList}>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        <i className="bi bi-ticket"></i>
                      </div>
                      <div className={styles.activityContent}>
                        <p className={styles.activityText}>New ticket submitted</p>
                        <span className={styles.activityTime}>5 minutes ago</span>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        <i className="bi bi-check-circle"></i>
                      </div>
                      <div className={styles.activityContent}>
                        <p className={styles.activityText}>Ticket #1234 resolved</p>
                        <span className={styles.activityTime}>15 minutes ago</span>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        <i className="bi bi-person-plus"></i>
                      </div>
                      <div className={styles.activityContent}>
                        <p className={styles.activityText}>New student registered</p>
                        <span className={styles.activityTime}>1 hour ago</span>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        <i className="bi bi-database"></i>
                      </div>
                      <div className={styles.activityContent}>
                        <p className={styles.activityText}>Database updated</p>
                        <span className={styles.activityTime}>2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Status Card */}
                <div className={styles.systemCard}>
                  <h3 className={styles.cardTitle}>
                    <i className="bi bi-activity"></i>
                    System Status
                  </h3>
                  <div className={styles.systemList}>
                    <div className={styles.systemItem}>
                      <div className={styles.systemInfo}>
                        <span className={styles.systemLabel}>API Server</span>
                        <span className={`${styles.systemStatus} ${styles.statusOnline}`}>
                          <i className="bi bi-check-circle-fill"></i>
                          Online
                        </span>
                      </div>
                      <div className={styles.systemBar}>
                        <div className={styles.systemProgress} style={{ width: "95%" }}></div>
                      </div>
                    </div>
                    <div className={styles.systemItem}>
                      <div className={styles.systemInfo}>
                        <span className={styles.systemLabel}>Database</span>
                        <span className={`${styles.systemStatus} ${styles.statusOnline}`}>
                          <i className="bi bi-check-circle-fill"></i>
                          Online
                        </span>
                      </div>
                      <div className={styles.systemBar}>
                        <div className={styles.systemProgress} style={{ width: "88%" }}></div>
                      </div>
                    </div>
                    <div className={styles.systemItem}>
                      <div className={styles.systemInfo}>
                        <span className={styles.systemLabel}>AI Assistant</span>
                        <span className={`${styles.systemStatus} ${styles.statusOnline}`}>
                          <i className="bi bi-check-circle-fill"></i>
                          Online
                        </span>
                      </div>
                      <div className={styles.systemBar}>
                        <div className={styles.systemProgress} style={{ width: "92%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Support Tickets Section */}
          {activeSection === "tickets" && (
            <div className={styles.ticketsSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <i className="bi bi-ticket-perforated"></i>
                  Support Tickets Management
                </h2>
                <p className={styles.sectionSubtitle}>
                  View, assign, and manage all support tickets
                </p>
              </div>
              <div className={styles.sectionContent}>
                {Ticket ? (
                  <Ticket isAdmin={true} />
                ) : (
                  <div className={styles.emptyState}>
                    <i className="bi bi-inbox"></i>
                    <p>No tickets component found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Departments Section */}
          {activeSection === "departments" && (
            <div className={styles.departmentsSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <i className="bi bi-building"></i>
                  Department Management
                </h2>
                <p className={styles.sectionSubtitle}>
                  Manage university departments and staff assignments
                </p>
              </div>
              <div className={styles.sectionContent}>
                {DepartmentSection ? (
                  <DepartmentSection />
                ) : (
                  <div className={styles.emptyState}>
                    <i className="bi bi-building"></i>
                    <p>No departments component found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Database Section */}
          {activeSection === "database" && (
            <div className={styles.databaseSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <i className="bi bi-database"></i>
                  AI Knowledge Base Management
                </h2>
                <p className={styles.sectionSubtitle}>
                  Update and manage the AI assistant's knowledge database
                </p>
              </div>
              <div className={styles.sectionContent}>
                {UpdateDatabase ? (
                  <UpdateDatabase />
                ) : (
                  <div className={styles.emptyState}>
                    <i className="bi bi-database"></i>
                    <p>No database component found.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}