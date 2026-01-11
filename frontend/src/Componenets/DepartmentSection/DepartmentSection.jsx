import { useState, useEffect } from "react";
import API_URL from "../../api";
import styles from "./DepartmentSection.module.css";

export default function DepartmentSection() {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch departments from backend
  const fetchDepartments = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch(`${API_URL}/departments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch departments");
      }
      
      const data = await res.json();
      console.log("Fetched departments:", data);
      
      // Handle both array and object with departments property
      setDepartments(Array.isArray(data) ? data : data.departments || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setMessage("Failed to fetch departments. Please try again.");
      setMessageType("error");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Add new department
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    
    if (!newDept.trim()) {
      setMessage("Department name is required.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      console.log("Adding department:", newDept);
      
      const res = await fetch(`${API_URL}/departments/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newDept }),
      });

      const data = await res.json();
      console.log("Add department response:", data);

      if (res.ok) {
        setMessage("Department added successfully!");
        setMessageType("success");
        setNewDept("");
        fetchDepartments(); // Refresh list
      } else {
        setMessage(data.message || "Failed to add department.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error adding department:", error);
      setMessage("Server error. Please try again later.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Delete department
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`))
      return;

    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/departments/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        throw new Error("Failed to delete department");
      }

      setMessage("Department deleted successfully.");
      setMessageType("success");
      fetchDepartments(); // Refresh list
    } catch (error) {
      console.error("Error deleting department:", error);
      setMessage("Failed to delete department.");
      setMessageType("error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleClear = () => {
    setNewDept("");
    setMessage("");
    setMessageType("");
  };

  return (
    <div className={styles.departmentPage}>
      <div className={styles.departmentContainer}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.headerIcon}>
            <i className="bi bi-building"></i>
          </div>
          <h2 className={styles.headerTitle}>Manage Departments</h2>
          <p className={styles.headerSubtitle}>
            Add, view, and manage all university departments
          </p>
        </div>

        {/* Stats */}
        <div className={styles.statsCard}>
          <div className={styles.statItem}>
            <i className="bi bi-building"></i>
            <div>
              <span className={styles.statValue}>
                {fetchLoading ? "..." : departments.length}
              </span>
              <span className={styles.statLabel}>Total Departments</span>
            </div>
          </div>
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

        {/* Add Department Form */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            <i className="bi bi-plus-circle"></i>
            Add New Department
          </h3>
          <form onSubmit={handleAddDepartment} className={styles.addForm}>
            <div className={styles.formGroup}>
              <label htmlFor="deptName" className={styles.formLabel}>
                Department Name
              </label>
              <div className={styles.inputWrapper}>
                <i className="bi bi-building"></i>
                <input
                  type="text"
                  id="deptName"
                  className={styles.input}
                  placeholder="e.g., Computer Science, Mathematics"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className={styles.inputHint}>
                <i className="bi bi-info-circle"></i>
                <span>Enter the full name of the department</span>
              </div>
            </div>
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClear}
                disabled={loading || !newDept}
              >
                <i className="bi bi-x-circle"></i>
                <span>Clear</span>
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading || !newDept.trim()}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-circle"></i>
                    <span>Add Department</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Departments List */}
        <div className={styles.listSection}>
          <div className={styles.listHeader}>
            <h3 className={styles.sectionTitle}>
              <i className="bi bi-list-ul"></i>
              Existing Departments
            </h3>
            <span className={styles.countBadge}>
              {departments.length} {departments.length === 1 ? "Department" : "Departments"}
            </span>
          </div>

          {fetchLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading departments...</p>
            </div>
          ) : departments.length > 0 ? (
            <div className={styles.departmentsGrid}>
              {departments.map((dept, index) => (
                <div
                  key={dept._id}
                  className={styles.departmentCard}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.cardIcon}>
                    <i className="bi bi-building"></i>
                  </div>
                  <div className={styles.cardContent}>
                    <h4 className={styles.deptName}>{dept.name}</h4>
                    <p className={styles.deptId}>
                      <i className="bi bi-hash"></i>
                      {dept._id?.slice(-6).toUpperCase()}
                    </p>
                  </div>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(dept._id, dept.name)}
                    disabled={deletingId === dept._id}
                    title="Delete department"
                  >
                    {deletingId === dept._id ? (
                      <span className={styles.buttonSpinner}></span>
                    ) : (
                      <i className="bi bi-trash"></i>
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <i className="bi bi-building"></i>
              <h4>No Departments Yet</h4>
              <p>Start by adding your first department above</p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <i className="bi bi-info-circle"></i>
            <div>
              <h5>Important Note</h5>
              <p>
                Deleting a department will affect all tickets assigned to it.
                Make sure to reassign tickets before deletion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
