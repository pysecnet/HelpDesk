import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartmentTickets,
  updateTicketStatus,
  clearDepartmentTicketState,
} from "../../features/departmentTicketSlice";
import API_URL from "../../api";
import styles from "./DepartmentDashboard.module.css";

export default function DepartmentDashboard() {
  const dispatch = useDispatch();
  const { tickets, loading, error, successMessage } = useSelector(
    (state) => state.departmentTickets
  );

  const user = useSelector((state) => state.user.user);

  // Local state for immediate UI updates
  const [localTickets, setLocalTickets] = useState([]);
  const [updatingTicketId, setUpdatingTicketId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeSection, setActiveSection] = useState("overview");
  const [departmentName, setDepartmentName] = useState("Department");

  // Ensure tickets is always an array
  const ticketList = Array.isArray(tickets) ? tickets : tickets?.tickets || [];

  useEffect(() => {
    dispatch(fetchDepartmentTickets());
    return () => {
      dispatch(clearDepartmentTicketState());
    };
  }, [dispatch]);

  // Extract department name from user or tickets
  useEffect(() => {
    // Strategy 1: Check if already in user object
    if (user?.department?.name) {
      setDepartmentName(user.department.name);
      return;
    }

    // Strategy 2: Extract from tickets when they load
    if (localTickets.length > 0) {
      const firstTicket = localTickets[0];
      
      // Check various possible structures
      if (firstTicket.department?.name) {
        console.log("Department name found in ticket:", firstTicket.department.name);
        setDepartmentName(firstTicket.department.name);
      } else if (firstTicket.departmentName) {
        console.log("Department name found in ticket:", firstTicket.departmentName);
        setDepartmentName(firstTicket.departmentName);
      } else if (firstTicket.departmentId?.name) {
        console.log("Department name found in ticket:", firstTicket.departmentId.name);
        setDepartmentName(firstTicket.departmentId.name);
      }
    }

    // Strategy 3: Fetch from API as last resort
    const fetchDepartmentName = async () => {
      if (user?.departmentId && departmentName === "Department") {
        try {
          const token = localStorage.getItem("token");
          
          // Try fetching all departments
          const res = await fetch(`${API_URL}/departments`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (res.ok) {
            const data = await res.json();
            const departments = data.departments || data;
            
            if (Array.isArray(departments)) {
              const userDept = departments.find(
                d => d._id === user.departmentId || d.id === user.departmentId
              );
              if (userDept?.name) {
                console.log("Department name found in API list:", userDept.name);
                setDepartmentName(userDept.name);
              }
            }
          }
        } catch (err) {
          console.error("Failed to fetch department name:", err);
        }
      }
    };

    fetchDepartmentName();
  }, [user, localTickets, departmentName]);

  // Update local tickets when Redux tickets change
  useEffect(() => {
    setLocalTickets(ticketList);
  }, [ticketList]);

  // Calculate stats
  const stats = {
    total: localTickets.length,
    assigned: localTickets.filter((t) => t.status === "Assigned").length,
    inProgress: localTickets.filter((t) => t.status === "In Progress").length,
    closed: localTickets.filter((t) => t.status === "Closed").length,
  };

  // Filter tickets
  const filteredTickets = localTickets.filter((ticket) => {
    if (filterStatus === "all") return true;
    return ticket.status === filterStatus;
  });

  const handleStatusChange = async (ticketId, newStatus) => {
    const ticket = localTickets.find((t) => t._id === ticketId);
    if (ticket?.status === newStatus) return;

    // Optimistic update
    setUpdatingTicketId(ticketId);
    setLocalTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );

    try {
      await dispatch(updateTicketStatus({ ticketId, status: newStatus })).unwrap();
      
      setTimeout(() => {
        dispatch(fetchDepartmentTickets());
      }, 500);
    } catch (err) {
      setLocalTickets(ticketList);
      console.error("Failed to update status:", err);
      alert(`Failed to update status: ${err}`);
    } finally {
      setUpdatingTicketId(null);
    }
  };

  const getStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case "Assigned":
        return [
          { value: "Assigned", label: "Assigned (Current)" },
          { value: "In Progress", label: "In Progress" },
          { value: "Closed", label: "Closed" },
        ];
      case "In Progress":
        return [
          { value: "In Progress", label: "In Progress (Current)" },
          { value: "Closed", label: "Closed" },
        ];
      case "Closed":
        return [{ value: "Closed", label: "Closed (Final)" }];
      case "Open":
        return [
          { value: "Open", label: "Open (Current)" },
          { value: "In Progress", label: "In Progress" },
          { value: "Closed", label: "Closed" },
        ];
      default:
        return [{ value: currentStatus, label: currentStatus }];
    }
  };

  return (
    <div className={styles.departmentPage}>
      <div className={styles.departmentContainer}>
        {/* Department Header */}
        <div className={styles.departmentHeader}>
          <div className={styles.headerContent}>
            <div className={styles.welcomeSection}>
              <div className={styles.departmentBadge}>
                <i className="bi bi-building"></i>
              </div>
              <div className={styles.welcomeText}>
                <h1 className={styles.welcomeTitle}>{departmentName} Dashboard</h1>
                <p className={styles.welcomeSubtitle}>
                  Welcome, <span className={styles.departmentName}>{user?.fullname || "Department Staff"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className={styles.errorAlert}>
            <i className="bi bi-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        {successMessage && !updatingTicketId && (
          <div className={styles.successAlert}>
            <i className="bi bi-check-circle"></i>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statTotal}`}>
            <div className={styles.statIcon}>
              <i className="bi bi-ticket-detailed"></i>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.total}</h3>
              <p className={styles.statLabel}>Total Tickets</p>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.statAssigned}`}>
            <div className={styles.statIcon}>
              <i className="bi bi-clipboard-check"></i>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.assigned}</h3>
              <p className={styles.statLabel}>Assigned</p>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.statProgress}`}>
            <div className={styles.statIcon}>
              <i className="bi bi-arrow-repeat"></i>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.inProgress}</h3>
              <p className={styles.statLabel}>In Progress</p>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.statClosed}`}>
            <div className={styles.statIcon}>
              <i className="bi bi-check-circle"></i>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.closed}</h3>
              <p className={styles.statLabel}>Closed</p>
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
            <span>All Tickets</span>
          </button>
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className={styles.overviewSection}>
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>Quick Filters</h3>
                <div className={styles.filterButtons}>
                  <button
                    className={`${styles.filterButton} ${
                      filterStatus === "all" ? styles.filterActive : ""
                    }`}
                    onClick={() => setFilterStatus("all")}
                  >
                    All Tickets ({stats.total})
                  </button>
                  <button
                    className={`${styles.filterButton} ${
                      filterStatus === "Assigned" ? styles.filterActive : ""
                    }`}
                    onClick={() => setFilterStatus("Assigned")}
                  >
                    Assigned ({stats.assigned})
                  </button>
                  <button
                    className={`${styles.filterButton} ${
                      filterStatus === "In Progress" ? styles.filterActive : ""
                    }`}
                    onClick={() => setFilterStatus("In Progress")}
                  >
                    In Progress ({stats.inProgress})
                  </button>
                  <button
                    className={`${styles.filterButton} ${
                      filterStatus === "Closed" ? styles.filterActive : ""
                    }`}
                    onClick={() => setFilterStatus("Closed")}
                  >
                    Closed ({stats.closed})
                  </button>
                </div>
              </div>

              {loading && !updatingTicketId ? (
                <div className={styles.loadingState}>
                  <div className={styles.spinner}></div>
                  <p>Loading tickets...</p>
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className={styles.emptyState}>
                  <i className="bi bi-inbox"></i>
                  <h3>No Tickets Found</h3>
                  <p>
                    {filterStatus === "all"
                      ? "No tickets assigned to your department yet."
                      : `No ${filterStatus.toLowerCase()} tickets found.`}
                  </p>
                </div>
              ) : (
                <div className={styles.ticketsGrid}>
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      className={`${styles.ticketCard} ${
                        updatingTicketId === ticket._id ? styles.ticketUpdating : ""
                      }`}
                    >
                      <div className={styles.ticketHeader}>
                        <h4 className={styles.ticketTitle}>{ticket.title}</h4>
                        <span
                          className={`${styles.statusBadge} ${
                            styles[`status${ticket.status.replace(/\s+/g, "")}`]
                          }`}
                        >
                          {ticket.status}
                          {updatingTicketId === ticket._id && (
                            <div className={styles.badgeSpinner}></div>
                          )}
                        </span>
                      </div>

                      <div className={styles.ticketMeta}>
                        <span className={styles.categoryBadge}>
                          <i className="bi bi-tag"></i>
                          {ticket.category}
                        </span>
                        <span className={styles.ticketNo}>
                          <i className="bi bi-hash"></i>
                          {ticket.ticketNo}
                        </span>
                      </div>

                      <p className={styles.ticketDescription}>
                        {ticket.description}
                      </p>

                      <div className={styles.ticketInfo}>
                        <div className={styles.infoItem}>
                          <i className="bi bi-envelope"></i>
                          <span>{ticket.studentEmail}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <i className="bi bi-telephone"></i>
                          <span>{ticket.studentPhone}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <i className="bi bi-clock"></i>
                          <span>
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className={styles.ticketActions}>
                        <label className={styles.actionLabel}>
                          <i className="bi bi-arrow-repeat"></i>
                          Update Status:
                        </label>
                        <select
                          className={styles.statusSelect}
                          value={ticket.status}
                          onChange={(e) =>
                            handleStatusChange(ticket._id, e.target.value)
                          }
                          disabled={
                            updatingTicketId === ticket._id ||
                            ticket.status === "Closed"
                          }
                        >
                          {getStatusOptions(ticket.status).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {ticket.status === "Closed" && (
                          <span className={styles.closedNote}>
                            <i className="bi bi-check-circle"></i>
                            This ticket is closed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* All Tickets Section */}
          {activeSection === "tickets" && (
            <div className={styles.ticketsSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <i className="bi bi-ticket-perforated"></i>
                  All {departmentName} Tickets
                </h2>
                <p className={styles.sectionSubtitle}>
                  Manage all tickets assigned to your department
                </p>
              </div>

              {loading && !updatingTicketId ? (
                <div className={styles.loadingState}>
                  <div className={styles.spinner}></div>
                  <p>Loading tickets...</p>
                </div>
              ) : localTickets.length === 0 ? (
                <div className={styles.emptyState}>
                  <i className="bi bi-inbox"></i>
                  <h3>No Tickets Found</h3>
                  <p>No tickets assigned to your department yet.</p>
                </div>
              ) : (
                <div className={styles.ticketsGrid}>
                  {localTickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      className={`${styles.ticketCard} ${
                        updatingTicketId === ticket._id ? styles.ticketUpdating : ""
                      }`}
                    >
                      <div className={styles.ticketHeader}>
                        <h4 className={styles.ticketTitle}>{ticket.title}</h4>
                        <span
                          className={`${styles.statusBadge} ${
                            styles[`status${ticket.status.replace(/\s+/g, "")}`]
                          }`}
                        >
                          {ticket.status}
                          {updatingTicketId === ticket._id && (
                            <div className={styles.badgeSpinner}></div>
                          )}
                        </span>
                      </div>

                      <div className={styles.ticketMeta}>
                        <span className={styles.categoryBadge}>
                          <i className="bi bi-tag"></i>
                          {ticket.category}
                        </span>
                        <span className={styles.ticketNo}>
                          <i className="bi bi-hash"></i>
                          {ticket.ticketNo}
                        </span>
                      </div>

                      <p className={styles.ticketDescription}>
                        {ticket.description}
                      </p>

                      <div className={styles.ticketInfo}>
                        <div className={styles.infoItem}>
                          <i className="bi bi-envelope"></i>
                          <span>{ticket.studentEmail}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <i className="bi bi-telephone"></i>
                          <span>{ticket.studentPhone}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <i className="bi bi-clock"></i>
                          <span>
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className={styles.ticketActions}>
                        <label className={styles.actionLabel}>
                          <i className="bi bi-arrow-repeat"></i>
                          Update Status:
                        </label>
                        <select
                          className={styles.statusSelect}
                          value={ticket.status}
                          onChange={(e) =>
                            handleStatusChange(ticket._id, e.target.value)
                          }
                          disabled={
                            updatingTicketId === ticket._id ||
                            ticket.status === "Closed"
                          }
                        >
                          {getStatusOptions(ticket.status).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {ticket.status === "Closed" && (
                          <span className={styles.closedNote}>
                            <i className="bi bi-check-circle"></i>
                            This ticket is closed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
