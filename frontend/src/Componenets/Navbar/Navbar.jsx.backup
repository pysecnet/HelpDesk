// src/components/Navbar/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/userSlice";
import logo from "../../assets/Logo.svg";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Redirect to home after logout
  };

  return (
    <div className={`container-fluid ${styles.navContainer}`}>
      <header
        className={`d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 border-bottom ${styles.header}`}
      >
        <div className={`col-md-3 mb-2 mb-md-0 ${styles.nav1}`}>
          <NavLink
            to="/"
            className="d-inline-flex align-items-center text-decoration-none"
          >
            <img src={logo} alt="UniDesk Logo" width="44" height="36" />
            <h1 className={`brand ${styles.brand}`}>UniHelp</h1>
          </NavLink>
        </div>

        <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li>
            <NavLink to="/" className={`nav-link px-2 ${styles.linkPrimary}`}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ai-assistant"
              className="nav-link link-secondary px-2"
            >
              AI Assistant
            </NavLink>
          </li>

          {/* Conditional Dashboard Links */}
          {user?.role === "student" && (
            <li>
              <NavLink
                to="/student-dashboard"
                className="nav-link link-secondary px-2"
              >
                Student Dashboard
              </NavLink>
            </li>
          )}
          {user?.role === "admin" && (
            <li>
              <NavLink
                to="/admin-dashboard"
                className="nav-link link-secondary px-2"
              >
                Admin Dashboard
              </NavLink>
            </li>
          )}
          {user?.role === "department" && (
            <li>
              <NavLink
                to="/department-dashboard"
                className="nav-link link-secondary px-2"
              >
                Department Dashboard
              </NavLink>
            </li>
          )}
        </ul>

        <div className="col-md-3 text-end">
          {!user ? (
            <>
              <NavLink to="/login" className={`btn me-2 ${styles.btnoutline}`}>
                Login
              </NavLink>
              <NavLink to="/signup" className={`btn ${styles.btn}`}>
                Sign-up
              </NavLink>
            </>
          ) : (
            <button onClick={handleLogout} className={`btn ${styles.btn}`}>
              Logout
            </button>
          )}
        </div>
      </header>
    </div>
  );
}
