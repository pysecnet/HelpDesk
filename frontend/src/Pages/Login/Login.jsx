import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { loginUser, clearError } from "../../features/userSlice";
import styles from "./Login.module.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

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
      return;
    }

    dispatch(loginUser(formData));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        {/* Left Side - Branding */}
        <div className={styles.loginBranding}>
          <div className={styles.brandingContent}>
            <div className={styles.brandingIcon}>
              <i className="bi bi-mortarboard"></i>
            </div>
            <h1 className={styles.brandingTitle}>
              Welcome to <span className={styles.brandAccent}>UniHelp</span>
            </h1>
            <p className={styles.brandingDescription}>
              Your comprehensive university support system for academic assistance
              and student services.
            </p>
            <div className={styles.brandingFeatures}>
              <div className={styles.featureItem}>
                <i className="bi bi-check-circle-fill"></i>
                <span>24/7 AI Assistant</span>
              </div>
              <div className={styles.featureItem}>
                <i className="bi bi-check-circle-fill"></i>
                <span>Instant Support</span>
              </div>
              <div className={styles.featureItem}>
                <i className="bi bi-check-circle-fill"></i>
                <span>Track Your Tickets</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={styles.loginFormSection}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Sign In</h2>
              <p className={styles.formSubtitle}>
                Enter your credentials to access your account
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className={styles.errorAlert}>
                <i className="bi bi-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.loginForm}>
              {/* Email Input */}
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
                    placeholder="Enter your email"
                    className={styles.input}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
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
                    placeholder="Enter your password"
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

              {/* Remember Me & Forgot Password */}
              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" className={styles.checkbox} />
                  <span>Remember me</span>
                </label>
                <NavLink to="/forgot-password" className={styles.forgotLink}>
                  Forgot Password?
                </NavLink>
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
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className={styles.divider}>
              <span>or continue with</span>
            </div>

            {/* Social Login */}
            <div className={styles.socialLogin}>
              <button className={styles.socialButton} disabled>
                <i className="bi bi-google"></i>
                <span>Google</span>
              </button>
              <button className={styles.socialButton} disabled>
                <i className="bi bi-microsoft"></i>
                <span>Microsoft</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className={styles.signupPrompt}>
              <p>
                Don't have an account?{" "}
                <NavLink to="/signup" className={styles.signupLink}>
                  Sign up
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
