import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TicketForm from "../../Componenets/TicketForm/TicketForm";
import { fetchMyTickets } from "../../features/ticketSlice";
import styles from "./StudentDashboard.module.css";
import TicketCard from "../../Componenets/TicketCard/TicketCard";
export default function StudentDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    tickets = [],
    loading,
    error,
  } = useSelector((state) => state.tickets);

  const user = useSelector((state) => state.user.user);

  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    dispatch(fetchMyTickets());
  }, [dispatch]);

  const hasOpenTicket = tickets.some(
    (t) => t.status === "Open" || t.status === "In Progress"
  );

  // Calculate stats
  const stats = {
  total: tickets.length,
  open: tickets.filter((t) => t.status === "Open" || t.status === "Assigned").length,
  inProgress: tickets.filter((t) => t.status === "In Progress").length,
  resolved: tickets.filter((t) => t.status === "Closed").length,
};

  const handleNavigateToAI = () => {
    navigate("/ai-assistant");
  };

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardContainer}>
        {/* Dashboard Header */}
        <div className={styles.dashboardHeader}>
          <div className={styles.headerContent}>
            <div className={styles.welcomeSection}>
              <h1 className={styles.welcomeTitle}>
                Welcome back, <span className={styles.userName}>{user?.fullname || "Student"}</span>
              </h1>
              <p className={styles.welcomeSubtitle}>
                Here's what's happening with your support tickets today
              </p>
            </div>
            <div className={styles.headerActions}>
              <button
                className={styles.aiButton}
                onClick={handleNavigateToAI}
              >
                <i className="bi bi-robot"></i>
                <span>AI Assistant</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statTotal}`}>
            <div className={styles.statIcon}>
              <i className="bi bi-ticket-perforated"></i>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.total}</h3>
              <p className={styles.statLabel}>Total Tickets</p>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.statOpen}`}>
            <div className={styles.statIcon}>
              <i className="bi bi-clock-history"></i>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.open}</h3>
              <p className={styles.statLabel}>Open Tickets</p>
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

          <div className={`${styles.statCard} ${styles.statResolved}`}>
            <div className={styles.statIcon}>
              <i className="bi bi-check-circle"></i>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.resolved}</h3>
              <p className={styles.statLabel}>Resolved</p>
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
              activeSection === "create" ? styles.tabActive : ""
            }`}
            onClick={() => setActiveSection("create")}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Submit Ticket</span>
          </button>
          <button
            className={`${styles.tab} ${
              activeSection === "view" ? styles.tabActive : ""
            }`}
            onClick={() => setActiveSection("view")}
          >
            <i className="bi bi-list-ul"></i>
            <span>My Tickets</span>
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
                      onClick={() => setActiveSection("create")}
                      disabled={hasOpenTicket}
                    >
                      <div className={styles.actionIcon}>
                        <i className="bi bi-ticket"></i>
                      </div>
                      <div className={styles.actionContent}>
                        <h4>Submit New Ticket</h4>
                        <p>Get help from our support team</p>
                      </div>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                    
                    <button
                      className={styles.actionItem}
                      onClick={handleNavigateToAI}
                    >
                      <div className={styles.actionIcon}>
                        <i className="bi bi-robot"></i>
                      </div>
                      <div className={styles.actionContent}>
                        <h4>Ask AI Assistant</h4>
                        <p>Get instant answers 24/7</p>
                      </div>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                    
                    <button
                      className={styles.actionItem}
                      onClick={() => setActiveSection("view")}
                    >
                      <div className={styles.actionIcon}>
                        <i className="bi bi-list-check"></i>
                      </div>
                      <div className={styles.actionContent}>
                        <h4>View My Tickets</h4>
                        <p>Track your support requests</p>
                      </div>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>

                {/* Recent Tickets Card */}
                <div className={styles.recentTicketsCard}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>
                      <i className="bi bi-clock-history"></i>
                      Recent Tickets
                    </h3>
                    <button
                      className={styles.viewAllButton}
                      onClick={() => setActiveSection("view")}
                    >
                      View All
                    </button>
                  </div>
                  
                  {tickets.length === 0 ? (
                    <div className={styles.emptyState}>
                      <i className="bi bi-inbox"></i>
                      <p>No tickets yet</p>
                      <button
                        className={styles.emptyStateButton}
                        onClick={() => setActiveSection("create")}
                        disabled={hasOpenTicket}
                      >
                        Create Your First Ticket
                      </button>
                    </div>
                  ) : (
                    <div className={styles.recentTicketsList}>
                      {tickets.slice(0, 3).map((ticket) => (
                        <div key={ticket._id} className={styles.ticketPreview}>
                          <div className={styles.ticketPreviewHeader}>
                            <span className={styles.ticketCategory}>
                              {ticket.category}
                            </span>
                            <span
                              className={`${styles.ticketStatus} ${
                                styles[`status${ticket.status.replace(/\s+/g, "")}`]
                              }`}
                            >
                              {ticket.status}
                            </span>
                          </div>
                          <h4 className={styles.ticketTitle}>{ticket.subject}</h4>
                          <p className={styles.ticketDate}>
                            <i className="bi bi-calendar"></i>
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Help Tips Card */}
                <div className={styles.helpTipsCard}>
                  <h3 className={styles.cardTitle}>
                    <i className="bi bi-lightbulb"></i>
                    Help Tips
                  </h3>
                  <div className={styles.tipsList}>
                    <div className={styles.tipItem}>
                      <i className="bi bi-check2"></i>
                      <p>Try the AI Assistant for instant answers</p>
                    </div>
                    <div className={styles.tipItem}>
                      <i className="bi bi-check2"></i>
                      <p>Provide detailed information in your tickets</p>
                    </div>
                    <div className={styles.tipItem}>
                      <i className="bi bi-check2"></i>
                      <p>Check ticket status regularly for updates</p>
                    </div>
                    <div className={styles.tipItem}>
                      <i className="bi bi-check2"></i>
                      <p>One ticket at a time ensures faster resolution</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Create Ticket Section */}
          {activeSection === "create" && (
            <div className={styles.createSection}>
              {!hasOpenTicket ? (
                <div className={styles.formWrapper}>
                  <div className={styles.formHeader}>
                    <h2 className={styles.formTitle}>Submit Support Ticket</h2>
                    <p className={styles.formSubtitle}>
                      Fill out the form below to get help from our support team
                    </p>
                  </div>
                  <TicketForm />
                </div>
              ) : (
                <div className={styles.warningCard}>
                  <div className={styles.warningIcon}>
                    <i className="bi bi-exclamation-triangle"></i>
                  </div>
                  <h3 className={styles.warningTitle}>Active Ticket Exists</h3>
                  <p className={styles.warningText}>
                    You already have an active ticket (Open or In Progress). Please wait
                    for it to be resolved before submitting a new one.
                  </p>
                  <button
                    className={styles.warningButton}
                    onClick={() => setActiveSection("view")}
                  >
                    View My Tickets
                  </button>
                </div>
              )}
            </div>
          )}

          {/* View Tickets Section */}
          {activeSection === "view" && (
            <div className={styles.viewSection}>
              <div className={styles.viewHeader}>
                <h2 className={styles.viewTitle}>My Tickets</h2>
                <p className={styles.viewSubtitle}>
                  View and track all your support requests
                </p>
              </div>

              {loading && (
                <div className={styles.loadingState}>
                  <div className={styles.spinner}></div>
                  <p>Loading your tickets...</p>
                </div>
              )}

              {error && (
                <div className={styles.errorState}>
                  <i className="bi bi-exclamation-circle"></i>
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && tickets.length === 0 && (
                <div className={styles.emptyState}>
                  <i className="bi bi-inbox"></i>
                  <h3>No Tickets Found</h3>
                  <p>You haven't submitted any support tickets yet.</p>
                  <button
                    className={styles.emptyStateButton}
                    onClick={() => setActiveSection("create")}
                    disabled={hasOpenTicket}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Create Your First Ticket
                  </button>
                </div>
              )}

              {!loading && !error && tickets.length > 0 && (
                <div className={styles.ticketsList}>
                 {tickets.map((ticket) => (
  <TicketCard key={ticket._id} ticket={ticket} />
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
