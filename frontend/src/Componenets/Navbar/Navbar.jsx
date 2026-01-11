// src/components/Navbar/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/userSlice";
import logo from "../../assets/Logo.svg";
import styles from "./Navbar.module.css";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <NavLink to="/" className={styles.logoLink} onClick={closeMobileMenu}>
            <div className={styles.logoWrapper}>
              <img src={logo} alt="UniHelp Logo" className={styles.logoImage} />
            </div>
            <span className={styles.brandName}>
              <span className={styles.brandPrimary}>Uni</span>
              <span className={styles.brandSecondary}>Help</span>
            </span>
          </NavLink>
        </div>

        {/* Desktop Navigation Links */}
        <ul className={`${styles.navLinks} ${mobileMenuOpen ? styles.navLinksOpen : ''}`}>
          <li className={styles.navItem}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
              onClick={closeMobileMenu}
            >
              <i className="bi bi-house-door me-1"></i>
              Home
            </NavLink>
          </li>
          
          <li className={styles.navItem}>
            <NavLink
              to="/ai-assistant"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
              onClick={closeMobileMenu}
            >
              <i className="bi bi-robot me-1"></i>
              AI Assistant
            </NavLink>
          </li>

          {/* Conditional Dashboard Links */}
          {user?.role === "student" && (
            <li className={styles.navItem}>
              <NavLink
                to="/student-dashboard"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                }
                onClick={closeMobileMenu}
              >
                <i className="bi bi-grid me-1"></i>
                Dashboard
              </NavLink>
            </li>
          )}
          
          {user?.role === "admin" && (
            <li className={styles.navItem}>
              <NavLink
                to="/admin-dashboard"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                }
                onClick={closeMobileMenu}
              >
                <i className="bi bi-shield-check me-1"></i>
                Admin Dashboard
              </NavLink>
            </li>
          )}
          
          {user?.role === "department" && (
            <li className={styles.navItem}>
              <NavLink
                to="/department-dashboard"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                }
                onClick={closeMobileMenu}
              >
                <i className="bi bi-building me-1"></i>
                Department Dashboard
              </NavLink>
            </li>
          )}

          {/* Mobile-only Auth Buttons */}
          {!user && (
            <div className={styles.mobileAuthButtons}>
              <NavLink 
                to="/login" 
                className={styles.btnOutlineMobile}
                onClick={closeMobileMenu}
              >
                Login
              </NavLink>
              <NavLink 
                to="/signup" 
                className={styles.btnPrimaryMobile}
                onClick={closeMobileMenu}
              >
                Sign up
              </NavLink>
            </div>
          )}

          {user && (
            <div className={styles.mobileAuthButtons}>
              <button 
                onClick={handleLogout} 
                className={styles.btnPrimaryMobile}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </div>
          )}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className={styles.authSection}>
          {!user ? (
            <>
              <NavLink to="/login" className={styles.btnOutline}>
                Login
              </NavLink>
              <NavLink to="/signup" className={styles.btnPrimary}>
                Sign up
              </NavLink>
            </>
          ) : (
            <div className={styles.userSection}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  <i className="bi bi-person"></i>
                </div>
                <span className={styles.userRole}>{user.role}</span>
              </div>
              <button onClick={handleLogout} className={styles.btnPrimary}>
                <i className="bi bi-box-arrow-right me-1"></i>
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={styles.mobileMenuToggle}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <i className="bi bi-x-lg"></i>
          ) : (
            <i className="bi bi-list"></i>
          )}
        </button>
      </div>
    </nav>
  );
}
