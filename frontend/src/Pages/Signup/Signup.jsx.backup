import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signupUser, clearError } from "../../features/userSlice";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    rollNumber: "",
    gender: "",
    dob: "",
    address: "",
    phone: "",
    role: "student",
  });

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect after signup
  useEffect(() => {
    if (user?.role === "student") {
      navigate("/student-dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-format roll number to uppercase
    if (name === "rollNumber") {
      setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear validation error when user starts typing
    if (validationError) setValidationError("");
  };

  const validateRollNumber = (rollNumber) => {
    const rollNumberRegex = /^2K\d{2}-(CS|IT|EE|ME|CE)-\d+$/i;
    return rollNumberRegex.test(rollNumber);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^0\d{3}-\d{7}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    // Validate all required fields
    if (!formData.fullname || !formData.email || !formData.password || 
        !formData.rollNumber || !formData.gender || !formData.dob || 
        !formData.address || !formData.phone) {
      setValidationError("All fields are required for student registration");
      return;
    }

    // Validate roll number format
    if (!validateRollNumber(formData.rollNumber)) {
      setValidationError("Invalid roll number format. Use: 2K26-IT-1, 2K23-CS-15, etc.");
      return;
    }

    // Validate phone format
    if (!validatePhone(formData.phone)) {
      setValidationError("Invalid phone format. Use: 0316-3280715");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      return;
    }

    dispatch(signupUser(formData));
  };

  return (
    <div
      className="container mt-5 p-4 shadow rounded"
      style={{ maxWidth: "500px" }}
    >
      <h2 className="mb-2 text-center">Create Student Account</h2>
      <p className="text-danger text-center small mb-4">
        All fields are required for student registration: fullname, email, password, rollNumber, gender, dob, address, phone
      </p>

      {(error || validationError) && (
        <div className="alert alert-danger" role="alert">
          {validationError || error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
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

        {/* Email */}
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

        {/* Password */}
        <div className="mb-3">
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password * (min 6 characters)"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        {/* Roll Number */}
        <div className="mb-3">
          <input
            type="text"
            name="rollNumber"
            value={formData.rollNumber}
            placeholder="Roll Number * (e.g., 2K26-IT-1)"
            className="form-control text-uppercase"
            onChange={handleChange}
            required
          />
          <small className="form-text text-muted">
            Format: 2K26-IT-1 (Departments: CS, IT, EE, ME, CE)
          </small>
        </div>

        {/* Gender */}
        <div className="mb-3">
          <select
            name="gender"
            value={formData.gender}
            className="form-select"
            onChange={handleChange}
            required
          >
            <option value="">Select Gender *</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div className="mb-3">
          <label className="form-label text-muted small">Date of Birth *</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            className="form-control"
            max={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div className="mb-3">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            placeholder="Phone Number * (e.g., 0316-3280715)"
            className="form-control"
            onChange={handleChange}
            required
          />
          <small className="form-text text-muted">
            Format: 0316-3280715
          </small>
        </div>

        {/* Address */}
        <div className="mb-3">
          <textarea
            name="address"
            value={formData.address}
            placeholder="Address *"
            className="form-control"
            rows="2"
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center mt-3 text-muted">
        Already have an account?{" "}
        <a href="/login" className="text-primary">
          Login here
        </a>
      </p>
    </div>
  );
}

export default Signup;
