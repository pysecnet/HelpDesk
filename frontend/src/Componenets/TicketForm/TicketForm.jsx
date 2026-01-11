import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTicket, fetchMyTickets } from "../../features/ticketSlice";
import styles from "./TicketForm.module.css";

export default function TicketForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    studentEmail: "",
    studentPhone: "",
    priority: "Medium", // ✅ NEW: Default priority
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setMessageType("");

    try {
      const res = await dispatch(addTicket(formData)).unwrap();
      setMessage(res?.message || "Ticket created successfully! We'll get back to you soon.");
      setMessageType("success");
      setFormData({
        title: "",
        category: "",
        description: "",
        studentEmail: "",
        studentPhone: "",
        priority: "Medium", // ✅ Reset to default
      });
      await dispatch(fetchMyTickets());
    } catch (err) {
      setMessage(err?.message || "Error creating ticket. Please try again.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      studentEmail: "",
      studentPhone: "",
      priority: "Medium", // ✅ Reset to default
    });
    setMessage("");
    setMessageType("");
  };

  return (
    <div className={styles.ticketFormPage}>
      <div className={styles.formContainer}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.headerIcon}>
            <i className="bi bi-ticket-perforated"></i>
          </div>
          <h2 className={styles.headerTitle}>Submit Support Ticket</h2>
          <p className={styles.headerSubtitle}>
            Fill out the form below and our support team will assist you as soon as possible
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`${styles.messageAlert} ${
              messageType === "success" ? styles.alertSuccess : styles.alertError
            }`}
          >
            <i
              className={`bi ${
                messageType === "success"
                  ? "bi-check-circle-fill"
                  : "bi-exclamation-circle-fill"
              }`}
            ></i>
            <span>{message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.ticketForm}>
          {/* Ticket Information Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <i className="bi bi-info-circle"></i>
              Ticket Information
            </h3>

            {/* Title */}
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.formLabel}>
                Ticket Title
              </label>
              <div className={styles.inputWrapper}>
                <i className="bi bi-pencil"></i>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Brief title for your issue"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputHint}>
                <i className="bi bi-info-circle"></i>
                <span>Provide a clear, concise title</span>
              </div>
            </div>

            {/* Category */}
            <div className={styles.formGroup}>
              <label htmlFor="category" className={styles.formLabel}>
                Category
              </label>
              <div className={styles.inputWrapper}>
                <i className="bi bi-tag"></i>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className={styles.select}
                >
                  <option value="">Select a category</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Academic Query">Academic Query</option>
                  <option value="Administrative Help">Administrative Help</option>
                  <option value="Enrollment">Enrollment</option>
                  <option value="Financial Aid">Financial Aid</option>
                  <option value="Library Services">Library Services</option>
                  <option value="IT Support">IT Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className={styles.inputHint}>
                <i className="bi bi-info-circle"></i>
                <span>Choose the category that best matches your issue</span>
              </div>
            </div>

            {/* ✅ NEW: Priority Selector */}
            <div className={styles.formGroup}>
              <label htmlFor="priority" className={styles.formLabel}>
                Priority Level
              </label>
              <div className={styles.inputWrapper}>
                <i className="bi bi-flag-fill"></i>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className={styles.select}
                  style={{
                    borderLeft: `4px solid ${
                      formData.priority === "Urgent" ? "#dc3545" :
                      formData.priority === "High" ? "#fd7e14" :
                      formData.priority === "Medium" ? "#ffc107" : "#28a745"
                    }`
                  }}
                >
                  <option value="Low">🟢 Low - General inquiry</option>
                  <option value="Medium">🟡 Medium - Standard issue</option>
                  <option value="High">🟠 High - Important matter</option>
                  <option value="Urgent">🔴 Urgent - Needs immediate attention</option>
                </select>
              </div>
              <div className={styles.inputHint}>
                <i className="bi bi-info-circle"></i>
                <span>
                  {formData.priority === "Urgent" && "⚡ Urgent tickets are prioritized for fastest response"}
                  {formData.priority === "High" && "⚡ High priority tickets receive expedited handling"}
                  {formData.priority === "Medium" && "📋 Standard processing time applies"}
                  {formData.priority === "Low" && "📋 Will be addressed during regular support hours"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.formLabel}>
                Description
              </label>
              <div className={styles.inputWrapper}>
                <i className="bi bi-chat-left-text"></i>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your issue in detail..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows="5"
                  className={styles.textarea}
                ></textarea>
              </div>
              <div className={styles.inputHint}>
                <i className="bi bi-info-circle"></i>
                <span>Provide as much detail as possible to help us assist you better</span>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <i className="bi bi-person"></i>
              Contact Information
            </h3>

            {/* Email */}
            <div className={styles.formGroup}>
              <label htmlFor="studentEmail" className={styles.formLabel}>
                Email Address
              </label>
              <div className={styles.inputWrapper}>
                <i className="bi bi-envelope"></i>
                <input
                  type="email"
                  id="studentEmail"
                  name="studentEmail"
                  placeholder="your.email@university.edu"
                  value={formData.studentEmail}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputHint}>
                <i className="bi bi-info-circle"></i>
                <span>We'll send updates to this email</span>
              </div>
            </div>

            {/* Phone */}
            <div className={styles.formGroup}>
              <label htmlFor="studentPhone" className={styles.formLabel}>
                Phone Number
              </label>
              <div className={styles.inputWrapper}>
                <i className="bi bi-telephone"></i>
                <input
                  type="tel"
                  id="studentPhone"
                  name="studentPhone"
                  placeholder="e.g., 0316-3280715"
                  value={formData.studentPhone}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputHint}>
                <i className="bi bi-info-circle"></i>
                <span>Format: 0316-3280715</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
              disabled={isSubmitting}
            >
              <i className="bi bi-x-circle"></i>
              <span>Clear Form</span>
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-send"></i>
                  <span>Submit Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className={styles.helpSection}>
          <div className={styles.helpCard}>
            <div className={styles.helpIcon}>
              <i className="bi bi-lightbulb"></i>
            </div>
            <div className={styles.helpContent}>
              <h4>Need Immediate Help?</h4>
              <p>Try our AI Assistant for instant answers to common questions</p>
              <button className={styles.helpButton}>
                <i className="bi bi-robot"></i>
                Ask AI Assistant
              </button>
            </div>
          </div>
          
          <div className={styles.helpCard}>
            <div className={styles.helpIcon}>
              <i className="bi bi-clock-history"></i>
            </div>
            <div className={styles.helpContent}>
              <h4>Response Time</h4>
              <p>
                {formData.priority === "Urgent" && "⚡ Urgent: Within 2-4 hours"}
                {formData.priority === "High" && "⚡ High: Within 12-24 hours"}
                {formData.priority === "Medium" && "📋 Medium: 24-48 hours"}
                {formData.priority === "Low" && "📋 Low: 2-3 business days"}
              </p>
              <p className={styles.helpNote}>
                {formData.priority === "Urgent" || formData.priority === "High" 
                  ? "Your issue will be prioritized" 
                  : "Standard processing applies"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}