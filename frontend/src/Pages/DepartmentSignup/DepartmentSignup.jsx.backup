import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api";

function DepartmentSignup() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    departmentId: "",
    role: "department", // ✅ Fixed as department
  });

  useEffect(() => {
    // Fetch departments
    const fetchDepartments = async () => {
      try {
        const res = await fetch(`${API_URL}/departments`);
        const data = await res.json();
        setDepartments(data.departments || []);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
        setError("Failed to load departments");
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullname || !formData.email || !formData.password || !formData.departmentId) {
      setError("Please fill all required fields!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      // Store token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Department account created successfully!");
      navigate("/department-dashboard");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container mt-5 p-4 shadow rounded"
      style={{ maxWidth: "500px" }}
    >
      <h2 className="mb-4 text-center">Department Registration</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            placeholder="Full Name *"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email Address *"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password *"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <select
            name="departmentId"
            value={formData.departmentId}
            className="form-select"
            onChange={handleChange}
            required
          >
            <option value="">Select Your Department *</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Register as Department"}
        </button>
      </form>

      <p className="text-center mt-3 text-muted">
        Student registration?{" "}
        <a href="/signup" className="text-primary">
          Sign up here
        </a>
      </p>
    </div>
  );
}

export default DepartmentSignup;
