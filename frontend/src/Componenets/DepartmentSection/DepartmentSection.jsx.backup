import { useState, useEffect } from "react";
import API_URL from "../../api";

export default function DepartmentSection() {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch departments from backend
  const fetchDepartments = async () => {
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
      console.log("Fetched departments:", data); // Debug log
      
      // Handle both array and object with departments property
      setDepartments(Array.isArray(data) ? data : data.departments || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setMessage("⚠️ Failed to fetch departments.");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Add new department
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    
    if (!newDept.trim()) {
      setMessage("❌ Department name is required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      console.log("Adding department:", newDept); // Debug log
      
      const res = await fetch(`${API_URL}/departments/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newDept }),
      });

      const data = await res.json();
      console.log("Add department response:", data); // Debug log

      if (res.ok) {
        setMessage("✅ Department added successfully!");
        setNewDept("");
        fetchDepartments(); // Refresh list
      } else {
        setMessage(`❌ Error: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding department:", error);
      setMessage("⚠️ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Delete department
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;

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

      setMessage("🗑️ Department deleted successfully.");
      fetchDepartments(); // Refresh list
    } catch (error) {
      console.error("Error deleting department:", error);
      setMessage("⚠️ Failed to delete department.");
    }
  };

  return (
    <div className="container my-5 text-start">
      <h3 className="mb-4 fw-bold text-center">🏢 Manage Departments</h3>

      {/* Add Department Form */}
      <form
        onSubmit={handleAddDepartment}
        className="border p-4 rounded shadow-sm bg-light mb-4"
      >
        <label className="form-label fw-semibold">Add New Department:</label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter department name"
            value={newDept}
            onChange={(e) => setNewDept(e.target.value)}
            disabled={loading}
          />
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
        {message && (
          <div className={`mt-3 alert ${message.includes("✅") ? "alert-success" : "alert-danger"}`}>
            {message}
          </div>
        )}
      </form>

      {/* Departments List */}
      <h5 className="fw-bold mb-3">Existing Departments:</h5>
      <ul className="list-group">
        {departments.length > 0 ? (
          departments.map((dept) => (
            <li
              key={dept._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{dept.name}</span>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(dept._id)}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <li className="list-group-item text-muted">No departments found.</li>
        )}
      </ul>
    </div>
  );
}
