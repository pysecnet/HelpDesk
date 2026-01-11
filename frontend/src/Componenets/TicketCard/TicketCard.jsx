// components/TicketCard/TicketCard.jsx
import { useState } from "react";
import styles from "./TicketCard.module.css";

export default function TicketCard({ ticket }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Display "Resolved" instead of "Closed" for better UX
  const displayStatus = ticket.status === "Closed" ? "Resolved" : ticket.status;

  return (
    <div className={styles.ticketCard}>
      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <h4 className={styles.ticketTitle}>{ticket.title || "Untitled"}</h4>
          <div className={styles.ticketMeta}>
            <span className={styles.ticketNumber}>
              <i className="bi bi-hash"></i>
              {ticket.ticketNo || "N/A"}
            </span>
            <span className={styles.categoryBadge}>
              <i className="bi bi-tag"></i>
              {ticket.category || "N/A"}
            </span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <span
            className={`${styles.statusBadge} ${
              styles[`status${ticket.status?.replace(/\s+/g, "") || "Unknown"}`]
            }`}
          >
            {displayStatus || "Unknown"}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className={styles.cardBody}>
        <div className={styles.description}>
          <p className={styles.descriptionText}>
            {isExpanded
              ? ticket.description || "No description provided"
              : `${ticket.description?.slice(0, 100) || "No description"}${
                  ticket.description?.length > 100 ? "..." : ""
                }`}
          </p>
        </div>

        {/* Ticket Info */}
        <div className={styles.ticketInfo}>
          <div className={styles.infoItem}>
            <i className="bi bi-calendar"></i>
            <span>
              {ticket.createdAt
                ? new Date(ticket.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className={styles.infoItem}>
            <i className="bi bi-clock"></i>
            <span>
              {ticket.createdAt
                ? new Date(ticket.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className={styles.expandedDetails}>
            <div className={styles.detailsGrid}>
              {ticket.studentEmail && (
                <div className={styles.detailItem}>
                  <i className="bi bi-envelope"></i>
                  <div>
                    <span className={styles.detailLabel}>Email</span>
                    <span className={styles.detailValue}>
                      {ticket.studentEmail}
                    </span>
                  </div>
                </div>
              )}
              
              {ticket.studentPhone && (
                <div className={styles.detailItem}>
                  <i className="bi bi-telephone"></i>
                  <div>
                    <span className={styles.detailLabel}>Phone</span>
                    <span className={styles.detailValue}>
                      {ticket.studentPhone}
                    </span>
                  </div>
                </div>
              )}
              
              {ticket.studentRollNumber && (
                <div className={styles.detailItem}>
                  <i className="bi bi-person-badge"></i>
                  <div>
                    <span className={styles.detailLabel}>Roll Number</span>
                    <span className={styles.detailValue}>
                      {ticket.studentRollNumber}
                    </span>
                  </div>
                </div>
              )}
              
              {ticket.assignedDepartment && (
                <div className={styles.detailItem}>
                  <i className="bi bi-building"></i>
                  <div>
                    <span className={styles.detailLabel}>Department</span>
                    <span className={styles.detailValue}>
                      {ticket.assignedDepartment.name}
                    </span>
                  </div>
                </div>
              )}
              
              {ticket.updatedAt && (
                <div className={styles.detailItem}>
                  <i className="bi bi-clock-history"></i>
                  <div>
                    <span className={styles.detailLabel}>Last Updated</span>
                    <span className={styles.detailValue}>
                      {new Date(ticket.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className={styles.cardFooter}>
        <button
          className={styles.detailsButton}
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <>
              <i className="bi bi-chevron-up"></i>
              <span>Hide Details</span>
            </>
          ) : (
            <>
              <i className="bi bi-chevron-down"></i>
              <span>View Details</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}