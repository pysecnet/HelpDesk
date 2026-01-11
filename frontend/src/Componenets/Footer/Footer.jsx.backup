import { NavLink } from "react-router-dom";
import logo from "../../assets/Logo.svg";
import styles from "./Footer.module.css";
export default function Footer() {
  return (
    <div className={`container-fluid ${styles.footerContainer}`}>
      {" "}
      <footer className="row row-cols-1 row-cols-sm-2 row-cols-md-4 py-4 border border-bottom">
        {" "}
        <div className={`col mb-3 ${styles.col1}`}>
          {" "}
          <a
            href="/"
            className="d-flex align-items-center mb-3 link-body-emphasis text-decoration-none"
            aria-label="Bootstrap"
          >
            {" "}
            <img src={logo} alt="UniDesk Logo" width="44" height="36" />{" "}
            <h1 className={`${styles.heading}`}>UniHelp</h1>{" "}
          </a>{" "}
          <p className={`${styles.para}`}>
            Your comprehensive university support system for academic assistant
            and student services.
          </p>{" "}
        </div>{" "}
        <div className={`col mb-3 ${styles.col2}`}>
          {" "}
          <h5>Quick Access</h5>{" "}
          <ul className="nav flex-column">
            {" "}
            <li className="nav-item mb-2">
              <a
                href="#"
                className={`nav-link p-0 text-body-secondary ${styles.link}`}
              >
                AI Assistant
              </a>
            </li>{" "}
            <li className="nav-item mb-2">
              <a
                href="#"
                className={`nav-link p-0 text-body-secondary ${styles.link}`}
              >
                Submit Ticket
              </a>
            </li>{" "}
          </ul>{" "}
        </div>{" "}
        <div className="col mb-3">
          {" "}
          <h5>Support</h5>{" "}
          <div className="nav flex-column">
            {" "}
            <div className="nav-item mb-2">
              <div className="nav-link p-0 text-body-secondary">
                help@university.edu
              </div>
            </div>{" "}
            <div className="nav-item mb-2">
              <div className="nav-link p-0 text-body-secondary">
                (555) 123-444
              </div>
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="col mb-3">
          {" "}
          <h5>Hours</h5>{" "}
          <div className="nav flex-column">
            {" "}
            <div className="nav-item mb-2">
              <div className="nav-link p-0 text-body-secondary">
                Mon-Fri : 8:00 AM - 6:00 PM
              </div>
            </div>{" "}
            <div className="nav-item mb-2">
              <div href="#" className="nav-link p-0 text-body-secondary">
                Sat-Sun : 10:00 AM - 4:00 PM
              </div>
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className={` ${styles.separation}`}>
          <div className={`text-center text-muted ${styles.center}`}>
            © {new Date().getFullYear()} UniHelpDesk. All Rights Reserved.
          </div>
        </div>
      </footer>{" "}
    </div>
  );
}
