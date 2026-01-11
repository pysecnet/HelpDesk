import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { signupUser, clearError } from "../../features/userSlice";
import styles from "./Signup.module.css";

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

  const [showPassword, setShowPassword] = useState(false);
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
    // Updated regex to include DVM, CPT, CPD, SE
    const rollNumberRegex = /^2K\d{2}-(CS|IT|EE|ME|CE|SE|DVM|CPT|CPD)-\d+$/i;
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
      setValidationError("Invalid roll number format. Use: 2K26-IT-1, 2K26-DVM-1, 2K26-CPD-1, etc.");
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

  // Toggle password visibility
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
              <i className="bi bi-person-plus"></i>
            </div>
            <h1 className={styles.brandingTitle}>
              Join <span className={styles.brandAccent}>UniHelp</span>
            </h1>
            <p className={styles.brandingDescription}>
              Create your student account to access AI-powered assistance, submit
              support tickets, and track your academic journey.
            </p>
            <div className={styles.brandingFeatures}>
              <div className={styles.featureItem}>
                <i className="bi bi-check-circle-fill"></i>
                <span>Free AI Academic Assistant</span>
              </div>
              <div className={styles.featureItem}>
                <i className="bi bi-check-circle-fill"></i>
                <span>Personalized Support Dashboard</span>
              </div>
              <div className={styles.featureItem}>
                <i className="bi bi-check-circle-fill"></i>
                <span>Real-time Ticket Tracking</span>
              </div>
              <div className={styles.featureItem}>
                <i className="bi bi-check-circle-fill"></i>
                <span>24/7 Instant Help</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className={styles.signupFormSection}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Create Account</h2>
              <p className={styles.formSubtitle}>
                Fill in your details to get started
              </p>
            </div>

            {/* Error Message */}
            {(error || validationError) && (
              <div className={styles.errorAlert}>
                <i className="bi bi-exclamation-circle"></i>
                <span>{validationError || error}</span>
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
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Gender and Date of Birth Row */}
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="gender" className={styles.inputLabel}>
                      Gender
                    </label>
                    <div className={styles.inputWrapper}>
                      <i className="bi bi-gender-ambiguous"></i>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        className={styles.select}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

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
              </div>

              {/* Academic Information Section */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <i className="bi bi-mortarboard"></i>
                  Academic Information
                </h3>

                {/* Roll Number */}
                <div className={styles.inputGroup}>
                  <label htmlFor="rollNumber" className={styles.inputLabel}>
                    Roll Number
                  </label>
                  <div className={styles.inputWrapper}>
                    <i className="bi bi-hash"></i>
                    <input
                      type="text"
                      id="rollNumber"
                      name="rollNumber"
                      value={formData.rollNumber}
                      placeholder="e.g., 2K26-IT-1 or 2K26-DVM-1"
                      className={`${styles.input} ${styles.uppercase}`}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.inputHint}>
                    <i className="bi bi-info-circle"></i>
                    Format: 2K26-IT-1 (Departments: CS, IT, SE, EE, ME, CE, DVM, CPT, CPD)
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
                    <span>Create Account</span>
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className={styles.loginPrompt}>
              <p>
                Already have an account?{" "}
                <NavLink to="/login" className={styles.loginLink}>
                  Sign in
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;