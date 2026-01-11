import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, clearError } from "../../features/userSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({ email: "", password: "" });

  // Clear previous error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect after login
  useEffect(() => {
    if (!user || !user.role) return;

    const redirectMap = {
      student: "/student-dashboard",
      department: "/department-dashboard",
      admin: "/admin-dashboard",
    };

    const path = redirectMap[user.role] || "/";
    if (window.location.pathname !== path) {
      navigate(path, { replace: true });
    }
  }, [user, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend validation
    if (!formData.email || !formData.password) {
      alert("Please enter both email and password!");
      return;
    }

    dispatch(loginUser(formData));
  };

  return (
    <div
      className="container mt-5 p-4 shadow rounded"
      style={{ maxWidth: "400px" }}
    >
      <h2 className="mb-4 text-center">Login to UniDesk</h2>

      {/* Backend error message */}
      {error && <p className="text-danger text-center fw-semibold">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email Address"
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
            placeholder="Password"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
