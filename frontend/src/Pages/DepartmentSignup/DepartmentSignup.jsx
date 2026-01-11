import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import API_URL from "../../api";
import styles from "./DepartmentSignup.module.css";

function DepartmentSignup() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    departmentId: "",
    dob: "",
    phone: "",
    address: "",
    role: "department",
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

    if (
      !formData.fullname ||
      !formData.email ||
      !formData.password ||
      !formData.departmentId ||
      !formData.dob ||
      !formData.phone ||
      !formData.address
    ) {
      setError("Please fill all required fields!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
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

      navigate("/department-dashboard");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.signupContainer}>
        {/* Left Side - Branding */}
        <div className={styles.signupBranding}>
          <div className={styles.brandingContent}>
            <div className={styles.brandingIcon}>
              <i className="bi bi-building"></i>
            </div>
            <h1 className={styles.brandingTitle}>
              Join as <span className={styles.brandAccent}>Department Staff</span>
            </h1>
            <p className={styles.brandingDescription}>
              Create your department staff account to manage support tickets,
              assist students, and provide specialized help in your area of
              expertise.
            </p>
            <div className={styles.brandingFeatures}>
              <div className={styles.featureItem}>
                <i className="bi bi-check-circle-fill"></i>
                <span>Manage Department Tickets</span>
              </div>
              <div className={styles.featureItem}>
                <i className="bi bi-check-circle-fill"></i>
                <span>Track Support Status</span>
              </div>
              <div className={styles.featureItem}>
                <i className="bi bi-check-circle-fill"></i>
                <span>Help Students Efficiently</span>
              </div>
              <div className={styles.featureItem}>
                <i className="bi bi-check-circle-fill"></i>
                <span>Department Dashboard Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className={styles.signupFormSection}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Department Registration</h2>
              <p className={styles.formSubtitle}>
                Fill in your details to create a staff account
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className={styles.errorAlert}>
                <i className="bi bi-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.signupForm}>
              {/* Personal Information Section */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <i className="bi bi-person"></i>
                  Personal Information
                </h3>

                {/* Full Name */}
                <div className={styles.inputGroup}>
                  <label htmlFor="fullname" className={styles.inputLabel}>
                    Full Name
                  </label>
                  <div className={styles.inputWrapper}>
                    <i className="bi bi-person"></i>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      value={formData.fullname}
                      placeholder="Enter your full name"
                      className={styles.input}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Email and Password Row */}
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.inputLabel}>
                      Email Address
                    </label>
                    <div className={styles.inputWrapper}>
                      <i className="bi bi-envelope"></i>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        placeholder="your.email@university.edu"
                        className={styles.input}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.inputLabel}>
                      Password
                    </label>
                    <div className={styles.inputWrapper}>
                      <i className="bi bi-lock"></i>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        placeholder="Min 6 characters"
                        className={styles.input}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={togglePasswordVisibility}
                        aria-label="Toggle password visibility"
                      >
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className={styles.inputGroup}>
                  <label htmlFor="dob" className={styles.inputLabel}>
                    Date of Birth
                  </label>
                  <div className={styles.inputWrapper}>
                    <i className="bi bi-calendar"></i>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      value={formData.dob}
                      className={styles.input}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Department Information Section */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <i className="bi bi-building"></i>
                  Department Information
                </h3>

                {/* Department Selection */}
                <div className={styles.inputGroup}>
                  <label htmlFor="departmentId" className={styles.inputLabel}>
                    Your Department
                  </label>
                  <div className={styles.inputWrapper}>
                    <i className="bi bi-building"></i>
                    <select
                      id="departmentId"
                      name="departmentId"
                      value={formData.departmentId}
                      className={styles.select}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select your department</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.inputHint}>
                    <i className="bi bi-info-circle"></i>
                    Select the department you'll be working with
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <i className="bi bi-telephone"></i>
                  Contact Information
                </h3>

                {/* Phone */}
                <div className={styles.inputGroup}>
                  <label htmlFor="phone" className={styles.inputLabel}>
                    Phone Number
                  </label>
                  <div className={styles.inputWrapper}>
                    <i className="bi bi-telephone"></i>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      placeholder="e.g., 0316-3280715"
                      className={styles.input}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.inputHint}>
                    <i className="bi bi-info-circle"></i>
                    Format: 0316-3280715
                  </div>
                </div>

                {/* Address */}
                <div className={styles.inputGroup}>
                  <label htmlFor="address" className={styles.inputLabel}>
                    Address
                  </label>
                  <div className={styles.inputWrapper}>
                    <i className="bi bi-geo-alt"></i>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      placeholder="Enter your complete address"
                      className={styles.textarea}
                      rows="3"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span>Register as Department Staff</span>
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            {/* Login Links */}
            <div className={styles.loginPrompt}>
              <p>
                Already have an account?{" "}
                <NavLink to="/login" className={styles.loginLink}>
                  Sign in
                </NavLink>
              </p>
              <p>
                Student registration?{" "}
                <NavLink to="/signup" className={styles.loginLink}>
                  Sign up here
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepartmentSignup;
