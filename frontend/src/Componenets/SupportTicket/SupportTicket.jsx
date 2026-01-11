import { useState, useEffect } from "react";
import styles from "./SupportTicket.module.css";

export default function SupportTicket() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState(null);

  const departments = ["IT Support", "Finance", "Library", "Hostel", "Admin", "Academic Affairs", "Student Services"];

  // Example: Fetch tickets from backend later
  useEffect(() => {
    // Replace with API call
    setTickets([
      {
        id: 1,
        subject: "Wi-Fi Connectivity Issue in Dorm",
        description: "Unable to connect to Wi-Fi since morning. Tried restarting router and device but issue persists.",
        email: "student1@sau.edu.pk",
        phone: "0316-1234567",
        status: "Closed",
        submitted: "Aug 28, 2025",
        updated: "Aug 28, 2025",
        department: "IT Support",
      },
      {
        id: 2,
        subject: "Portal Login Error",
        description: "Can't log into student portal after password reset. Getting 'Invalid credentials' error.",
        email: "student2@sau.edu.pk",
        phone: "0321-2345678",
        status: "Open",
        submitted: "Aug 27, 2025",
        updated: "Aug 28, 2025",
        department: "",
      },
      {
        id: 3,
        subject: "Lab PC not working",
        description: "Computer in Lab 2 is not turning on. Need urgent fix for tomorrow's exam.",
        email: "student3@sau.edu.pk",
        phone: "0333-3456789",
        status: "In Progress",
        submitted: "Aug 25, 2025",
        updated: "Aug 26, 2025",
        department: "IT Support",
      },
    ]);
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchSearch =
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || ticket.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    closed: tickets.filter((t) => t.status === "Closed").length,
  };

  const handleAssignClick = (ticket) => {
    setSelectedTicket(ticket);
    setSelectedDepartment(ticket.department || "");
    setShowModal(true);
  };

  const handleAssignConfirm = () => {
    if (!selectedDepartment) {
      alert("Please select a department!");
      return;
    }
    
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              status: "In Progress",
              department: selectedDepartment,
              updated: new Date().toLocaleDateString(),
            }
          : t
      )
    );

    setShowModal(false);
    setSelectedTicket(null);
    setSelectedDepartment("");
  };

  const handleStatusChange = (id, newStatus) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: newStatus, updated: new Date().toLocaleDateString() } : t
      )
    );
  };

  const toggleExpand = (id) => {
    setExpandedTicket((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.supportTicketPage}>
      <div className={styles.supportContainer}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>
            <i className="bi bi-ticket-perforated"></i>
            Support Tickets Management
          </h2>
          <p className={styles.pageSubtitle}>
            Manage and assign all support tickets from students
          </p>
        </div>

        {/* Summary Cards */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statTotal}`}>
            <div className={styles.statIcon}>
              <i className="bi bi-ticket-detailed"></i>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{counts.total}</h3>
              <p className={styles.statLabel}>Total Tickets</p>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.statOpen}`}>
            <div className={styles.statIcon}>
              <i className="bi bi-clock-history"></i>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{counts.open}</h3>
              <p className={styles.statLabel}>Open</p>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.statProgress}`}>
            <div className={styles.statIcon}>
              <i className="bi bi-arrow-repeat"></i>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{counts.inProgress}</h3>
              <p className={styles.statLabel}>In Progress</p>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.statClosed}`}>
            <div className={styles.statIcon}>
              <i className="bi bi-check-circle"></i>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{counts.closed}</h3>
              <p className={styles.statLabel}>Resolved</p>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className={styles.controlsBar}>
          <div className={styles.searchWrapper}>
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search by subject or email..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.filterWrapper}>
            <i className="bi bi-funnel"></i>
            <select
              className={styles.filterSelect}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
          </div>
        </div>

        {/* Ticket List */}
        {filteredTickets.length > 0 ? (
          <div className={styles.ticketsGrid}>
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className={styles.ticketCard}>
                {/* Card Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.headerLeft}>
                    <h4 className={styles.ticketTitle}>{ticket.subject}</h4>
                    <div className={styles.ticketBadges}>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[`status${ticket.status.replace(/\s+/g, "")}`]
                        }`}
                      >
                        {ticket.status}
                      </span>
                      {ticket.department && (
                        <span className={styles.departmentBadge}>
                          <i className="bi bi-building"></i>
                          {ticket.department}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className={styles.cardBody}>
                  <p className={styles.ticketDescription}>
                    {expandedTicket === ticket.id
                      ? ticket.description
                      : `${ticket.description.slice(0, 80)}${
                          ticket.description.length > 80 ? "..." : ""
                        }`}
                  </p>

                  <div className={styles.ticketInfo}>
                    <div className={styles.infoItem}>
                      <i className="bi bi-envelope"></i>
                      <span>{ticket.email}</span>
                    </div>
                    {ticket.phone && (
                      <div className={styles.infoItem}>
                        <i className="bi bi-telephone"></i>
                        <span>{ticket.phone}</span>
                      </div>
                    )}
                    <div className={styles.infoItem}>
                      <i className="bi bi-calendar"></i>
                      <span>Submitted: {ticket.submitted}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <i className="bi bi-clock"></i>
                      <span>Updated: {ticket.updated}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className={styles.cardActions}>
                  <button
                    className={styles.viewButton}
                    onClick={() => toggleExpand(ticket.id)}
                  >
                    <i
                      className={`bi ${
                        expandedTicket === ticket.id
                          ? "bi-chevron-up"
                          : "bi-chevron-down"
                      }`}
                    ></i>
                    <span>
                      {expandedTicket === ticket.id ? "Hide" : "View"} Details
                    </span>
                  </button>
                  <button
                    className={styles.assignButton}
                    onClick={() => handleAssignClick(ticket)}
                    disabled={ticket.status === "Closed"}
                  >
                    <i className="bi bi-person-plus"></i>
                    <span>Assign</span>
                  </button>
                  <button
                    className={styles.closeButton}
                    onClick={() => handleStatusChange(ticket.id, "Closed")}
                    disabled={ticket.status === "Closed"}
                  >
                    <i className="bi bi-x-circle"></i>
                    <span>Close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <i className="bi bi-inbox"></i>
            <h3>No Tickets Found</h3>
            <p>No tickets match your search criteria.</p>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <i className="bi bi-building"></i>
                Assign Ticket to Department
              </h3>
              <button
                className={styles.modalClose}
                onClick={() => setShowModal(false)}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.ticketPreview}>
                <h4>{selectedTicket?.subject}</h4>
                <p>{selectedTicket?.description}</p>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Select Department</label>
                <select
                  className={styles.select}
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">Choose a department...</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleAssignConfirm}
                disabled={!selectedDepartment}
              >
                <i className="bi bi-check-circle"></i>
                Assign Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
