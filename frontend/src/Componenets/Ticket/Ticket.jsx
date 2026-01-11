import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyTickets,
  fetchAdminTickets,
  assignTicket,
  updateTicketPriority,
  addComment,
  uploadAttachment,
} from "../../features/ticketSlice";
import { fetchDepartments } from "../../features/departmentSlice";
import styles from "./Ticket.module.css";

export default function Ticket({ isAdmin = false }) {
  const dispatch = useDispatch();
  const API_URL = "http://localhost:5000"; // Update if needed
  
  const {
    tickets = [],
    loading,
    error,
  } = useSelector((state) => state.tickets);
  
  const { 
    departments = [], 
    loading: deptLoading,
    error: deptError 
  } = useSelector((state) => state.departments);

  const [expandedTicket, setExpandedTicket] = useState(null);
  const [assignedDept, setAssignedDept] = useState({});
  const [assigningTicket, setAssigningTicket] = useState(null);
  
  // ✅ NEW: States for new features
  const [selectedPriority, setSelectedPriority] = useState({});
  const [commentText, setCommentText] = useState({});
  const [uploadingFile, setUploadingFile] = useState({});
  const fileInputRef = useRef({});

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchAdminTickets());
      dispatch(fetchDepartments());
    } else {
      dispatch(fetchMyTickets());
    }
  }, [dispatch, isAdmin]);

  const toggleExpand = (ticketNo) => {
    setExpandedTicket((prev) => (prev === ticketNo ? null : ticketNo));
  };

  const handleAssign = async (ticketId, deptId) => {
    if (!deptId) {
      alert("Please select a department!");
      return;
    }
    setAssigningTicket(ticketId);
    setAssignedDept((prev) => ({ ...prev, [ticketId]: deptId }));
    
    try {
      await dispatch(assignTicket({ ticketId, departmentId: deptId })).unwrap();
    } catch (err) {
      console.error("Failed to assign ticket:", err);
    } finally {
      setAssigningTicket(null);
    }
  };

  // ✅ NEW: Handle priority change
  const handlePriorityChange = async (ticketId, priority) => {
    try {
      await dispatch(updateTicketPriority({ ticketId, priority })).unwrap();
      alert("Priority updated successfully!");
    } catch (err) {
      console.error("Failed to update priority:", err);
      alert("Failed to update priority");
    }
  };

  // ✅ NEW: Handle add comment
  const handleAddComment = async (ticketId) => {
    const message = commentText[ticketId];
    if (!message || message.trim() === "") {
      alert("Please enter a comment");
      return;
    }

    try {
      await dispatch(addComment({ ticketId, message })).unwrap();
      setCommentText((prev) => ({ ...prev, [ticketId]: "" }));
      // Refresh tickets to get updated data
      if (isAdmin) {
        dispatch(fetchAdminTickets());
      } else {
        dispatch(fetchMyTickets());
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment");
    }
  };

  // ✅ NEW: Handle file upload
  const handleFileUpload = async (ticketId, file) => {
    if (!file) return;

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setUploadingFile((prev) => ({ ...prev, [ticketId]: true }));

    try {
      await dispatch(uploadAttachment({ ticketId, file })).unwrap();
      alert("File uploaded successfully!");
      // Refresh tickets
      if (isAdmin) {
        dispatch(fetchAdminTickets());
      } else {
        dispatch(fetchMyTickets());
      }
      // Reset file input
      if (fileInputRef.current[ticketId]) {
        fileInputRef.current[ticketId].value = "";
      }
    } catch (err) {
      console.error("Failed to upload file:", err);
      alert("Failed to upload file");
    } finally {
      setUploadingFile((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  // ✅ NEW: Download file
  const handleDownloadFile = (ticketId, attachmentId, fileName) => {
    const token = localStorage.getItem("token");
    const url = `${API_URL}/api/tickets/${ticketId}/attachments/${attachmentId}/download`;
    
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.error("Download failed:", err);
        alert("Failed to download file");
      });
  };

  // ✅ NEW: Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // ✅ NEW: Format date/time for timeline
  const formatDateTime = (date) => {
    return new Date(date).toLocaleString();
  };

  // ✅ NEW: Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low": return "#28a745";
      case "Medium": return "#ffc107";
      case "High": return "#fd7e14";
      case "Urgent": return "#dc3545";
      default: return "#6c757d";
    }
  };

  const departmentsList = Array.isArray(departments) ? departments : [];

  // Loading State
  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading tickets...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={styles.errorState}>
        <i className="bi bi-exclamation-circle"></i>
        <p>Error loading tickets: {error}</p>
      </div>
    );
  }

  // Empty State
  if (!tickets || tickets.length === 0) {
    return (
      <div className={styles.emptyState}>
        <i className="bi bi-inbox"></i>
        <h3>No Tickets Found</h3>
        <p>{isAdmin ? "No tickets have been submitted yet." : "You haven't submitted any tickets yet."}</p>
      </div>
    );
  }

  return (
    <div className={styles.ticketContainer}>
      {/* Department Loading/Error Messages */}
      {isAdmin && deptLoading && (
        <div className={styles.infoAlert}>
          <i className="bi bi-info-circle"></i>
          <span>Loading departments...</span>
        </div>
      )}
      
      {isAdmin && deptError && (
        <div className={styles.warningAlert}>
          <i className="bi bi-exclamation-triangle"></i>
          <span>{deptError}</span>
        </div>
      )}

      {/* Tickets Grid */}
      <div className={styles.ticketsGrid}>
        {tickets.map((ticket) => (
          <div key={ticket._id} className={styles.ticketCard}>
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
                  {/* ✅ NEW: Priority Badge */}
                  <span 
                    className={styles.priorityBadge}
                    style={{ 
                      backgroundColor: getPriorityColor(ticket.priority),
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: "500"
                    }}
                  >
                    <i className="bi bi-flag-fill"></i> {ticket.priority || "Medium"}
                  </span>
                </div>
              </div>
              <div className={styles.headerRight}>
                <span
                  className={`${styles.statusBadge} ${
                    styles[`status${ticket.status?.replace(/\s+/g, "") || "Unknown"}`]
                  }`}
                >
                  {ticket.status || "Unknown"}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className={styles.cardBody}>
              <div className={styles.description}>
                <p className={styles.descriptionText}>
                  {expandedTicket === ticket.ticketNo
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
              {expandedTicket === ticket.ticketNo && (
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

                  {/* ✅ NEW: Priority Selector (Admin/Department only) */}
                  {isAdmin && (
                    <div className={styles.prioritySection} style={{ marginTop: "15px" }}>
                      <label className={styles.assignmentLabel}>
                        <i className="bi bi-flag-fill"></i>
                        Change Priority
                      </label>
                      <div className={styles.assignmentControls}>
                        <select
                          className={styles.departmentSelect}
                          value={selectedPriority[ticket._id] || ticket.priority || "Medium"}
                          onChange={(e) => {
                            setSelectedPriority((prev) => ({
                              ...prev,
                              [ticket._id]: e.target.value,
                            }));
                            handlePriorityChange(ticket._id, e.target.value);
                          }}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* ✅ NEW: File Attachments Section */}
                  {ticket.attachments && ticket.attachments.length > 0 && (
                    <div className={styles.attachmentsSection} style={{ marginTop: "15px" }}>
                      <h5 style={{ fontSize: "0.9rem", marginBottom: "10px", color: "#333" }}>
                        <i className="bi bi-paperclip"></i> Attachments ({ticket.attachments.length})
                      </h5>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {ticket.attachments.map((file) => (
                          <div
                            key={file._id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "8px 12px",
                              background: "#f8f9fa",
                              borderRadius: "6px",
                              border: "1px solid #e0e0e0",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <i className="bi bi-file-earmark" style={{ fontSize: "1.2rem", color: "#6c757d" }}></i>
                              <div>
                                <div style={{ fontSize: "0.85rem", fontWeight: "500", color: "#333" }}>
                                  {file.originalName}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "#6c757d" }}>
                                  {formatFileSize(file.fileSize)} • {file.uploadedByName}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownloadFile(ticket._id, file._id, file.originalName)}
                              style={{
                                padding: "4px 12px",
                                background: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                              }}
                            >
                              <i className="bi bi-download"></i> Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ✅ NEW: Upload File */}
                  <div className={styles.uploadSection} style={{ marginTop: "15px" }}>
                    <label className={styles.assignmentLabel}>
                      <i className="bi bi-paperclip"></i>
                      Attach File
                    </label>
                    <div className={styles.assignmentControls}>
                      <input
                        type="file"
                        ref={(el) => (fileInputRef.current[ticket._id] = el)}
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleFileUpload(ticket._id, e.target.files[0]);
                          }
                        }}
                        style={{ fontSize: "0.85rem" }}
                        disabled={uploadingFile[ticket._id]}
                      />
                      {uploadingFile[ticket._id] && (
                        <span style={{ fontSize: "0.8rem", color: "#6c757d", marginLeft: "10px" }}>
                          Uploading...
                        </span>
                      )}
                    </div>
                    <span className={styles.assignmentHint}>
                      <i className="bi bi-info-circle"></i>
                      Max 10MB (Images, PDFs, Documents, ZIP)
                    </span>
                  </div>

                  {/* ✅ NEW: Comments Section */}
                  {ticket.comments && ticket.comments.length > 0 && (
                    <div className={styles.commentsSection} style={{ marginTop: "20px" }}>
                      <h5 style={{ fontSize: "0.9rem", marginBottom: "10px", color: "#333" }}>
                        <i className="bi bi-chat-dots"></i> Comments ({ticket.comments.length})
                      </h5>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto" }}>
                        {ticket.comments.map((comment) => (
                          <div
                            key={comment._id}
                            style={{
                              padding: "10px 12px",
                              background: comment.userRole === "student" ? "#e3f2fd" : "#f1f8e9",
                              borderRadius: "8px",
                              borderLeft: `3px solid ${comment.userRole === "student" ? "#2196f3" : "#8bc34a"}`,
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                              <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#333" }}>
                                {comment.userName} 
                                <span style={{ 
                                  marginLeft: "8px", 
                                  fontSize: "0.7rem", 
                                  padding: "2px 6px", 
                                  background: "rgba(0,0,0,0.1)", 
                                  borderRadius: "3px" 
                                }}>
                                  {comment.userRole}
                                </span>
                              </span>
                              <span style={{ fontSize: "0.7rem", color: "#6c757d" }}>
                                {formatDateTime(comment.createdAt)}
                              </span>
                            </div>
                            <p style={{ fontSize: "0.85rem", color: "#333", margin: 0 }}>
                              {comment.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ✅ NEW: Add Comment */}
                  <div className={styles.addCommentSection} style={{ marginTop: "15px" }}>
                    <label className={styles.assignmentLabel}>
                      <i className="bi bi-chat-left-text"></i>
                      Add Comment
                    </label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <textarea
                        className={styles.departmentSelect}
                        value={commentText[ticket._id] || ""}
                        onChange={(e) =>
                          setCommentText((prev) => ({
                            ...prev,
                            [ticket._id]: e.target.value,
                          }))
                        }
                        placeholder="Type your comment here..."
                        rows="3"
                        style={{ flex: 1, resize: "vertical", padding: "8px", fontSize: "0.85rem" }}
                      />
                      <button
                        className={styles.assignButton}
                        onClick={() => handleAddComment(ticket._id)}
                        disabled={!commentText[ticket._id]?.trim()}
                        style={{ alignSelf: "flex-start" }}
                      >
                        <i className="bi bi-send"></i>
                        Send
                      </button>
                    </div>
                  </div>

                  {/* ✅ NEW: Timeline/History */}
                  {ticket.history && ticket.history.length > 0 && (
                    <div className={styles.timelineSection} style={{ marginTop: "20px" }}>
                      <h5 style={{ fontSize: "0.9rem", marginBottom: "10px", color: "#333" }}>
                        <i className="bi bi-clock-history"></i> Activity Timeline
                      </h5>
                      <div style={{ position: "relative", paddingLeft: "20px" }}>
                        {ticket.history
                          .slice()
                          .reverse()
                          .map((event, index) => (
                            <div
                              key={event._id || index}
                              style={{
                                position: "relative",
                                paddingBottom: "15px",
                                borderLeft: index !== ticket.history.length - 1 ? "2px solid #e0e0e0" : "none",
                              }}
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  left: "-8px",
                                  top: "0",
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "50%",
                                  background: "#007bff",
                                  border: "2px solid white",
                                }}
                              ></div>
                              <div style={{ marginLeft: "15px" }}>
                                <div style={{ fontSize: "0.8rem", color: "#333", fontWeight: "500" }}>
                                  {event.description}
                                </div>
                                <div style={{ fontSize: "0.7rem", color: "#6c757d", marginTop: "2px" }}>
                                  {event.performedByName} • {formatDateTime(event.createdAt)}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Admin Assignment Section */}
              {isAdmin && (
                <div className={styles.assignmentSection}>
                  <label className={styles.assignmentLabel}>
                    <i className="bi bi-building"></i>
                    Assign to Department
                  </label>
                  <div className={styles.assignmentControls}>
                    <select
                      className={styles.departmentSelect}
                      value={
                        assignedDept[ticket._id] ||
                        ticket.assignedDepartment?._id ||
                        ""
                      }
                      onChange={(e) =>
                        setAssignedDept((prev) => ({
                          ...prev,
                          [ticket._id]: e.target.value,
                        }))
                      }
                      disabled={
                        departmentsList.length === 0 ||
                        ticket.status === "Closed" ||
                        assigningTicket === ticket._id
                      }
                    >
                      <option value="">
                        {departmentsList.length === 0
                          ? "No departments available"
                          : "Select Department"}
                      </option>
                      {departmentsList.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <button
                      className={styles.assignButton}
                      onClick={() =>
                        handleAssign(ticket._id, assignedDept[ticket._id])
                      }
                      disabled={
                        !assignedDept[ticket._id] ||
                        departmentsList.length === 0 ||
                        ticket.status === "Closed" ||
                        assigningTicket === ticket._id
                      }
                    >
                      {assigningTicket === ticket._id ? (
                        <>
                          <span className={styles.buttonSpinner}></span>
                          Assigning...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle"></i>
                          Assign
                        </>
                      )}
                    </button>
                  </div>
                  {departmentsList.length === 0 && (
                    <span className={styles.assignmentHint}>
                      <i className="bi bi-info-circle"></i>
                      Please add departments first
                    </span>
                  )}
                  {ticket.status === "Closed" && (
                    <span className={styles.assignmentHint}>
                      <i className="bi bi-lock"></i>
                      Cannot reassign closed tickets
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className={styles.cardFooter}>
              <button
                className={styles.detailsButton}
                onClick={() => toggleExpand(ticket.ticketNo)}
              >
                {expandedTicket === ticket.ticketNo ? (
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
        ))}
      </div>
    </div>
  );
}