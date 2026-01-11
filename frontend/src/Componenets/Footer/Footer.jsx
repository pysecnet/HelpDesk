import { NavLink } from "react-router-dom";
import logo from "../../assets/Logo.svg";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "AI Assistant", path: "/ai-assistant", icon: "bi-robot" },
    { name: "Submit Ticket", path: "/student-dashboard", icon: "bi-ticket-perforated" },
    { name: "Track Status", path: "/student-dashboard", icon: "bi-clock-history" },
    { name: "FAQs", path: "/faqs", icon: "bi-question-circle" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Cookie Policy", path: "/cookies" },
    { name: "Accessibility", path: "/accessibility" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: "bi-facebook", url: "#" },
    { name: "Twitter", icon: "bi-twitter-x", url: "#" },
    { name: "LinkedIn", icon: "bi-linkedin", url: "#" },
    { name: "Instagram", icon: "bi-instagram", url: "#" },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerMain}>
        <div className={styles.footerContainer}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <NavLink to="/" className={styles.brandLink}>
              <div className={styles.logoWrapper}>
                <img src={logo} alt="UniHelp Logo" className={styles.logoImage} />
              </div>
              <span className={styles.brandName}>
                <span className={styles.brandPrimary}>Uni</span>
                <span className={styles.brandSecondary}>Help</span>
              </span>
            </NavLink>
            <p className={styles.brandDescription}>
              Your comprehensive university support system for academic assistance
              and student services. Get instant help with AI-powered solutions.
            </p>
            <div className={styles.socialLinks}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className={styles.socialLink}
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={`bi ${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Access */}
          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Quick Access</h3>
            <ul className={styles.linkList}>
              {quickLinks.map((link, index) => (
                <li key={index} className={styles.linkItem}>
                  <NavLink to={link.path} className={styles.footerLink}>
                    <i className={`bi ${link.icon}`}></i>
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Contact Us</h3>
            <ul className={styles.linkList}>
              <li className={styles.contactItem}>
                <i className="bi bi-envelope"></i>
                <div className={styles.contactDetails}>
                  <span className={styles.contactLabel}>Email</span>
                  <a href="mailto:help@university.edu" className={styles.contactLink}>
                    help@university.edu
                  </a>
                </div>
              </li>
              <li className={styles.contactItem}>
                <i className="bi bi-telephone"></i>
                <div className={styles.contactDetails}>
                  <span className={styles.contactLabel}>Phone</span>
                  <a href="tel:+15551234567" className={styles.contactLink}>
                    (555) 123-4567
                  </a>
                </div>
              </li>
              <li className={styles.contactItem}>
                <i className="bi bi-geo-alt"></i>
                <div className={styles.contactDetails}>
                  <span className={styles.contactLabel}>Location</span>
                  <span className={styles.contactText}>
                    123 University Ave, Campus
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Support Hours</h3>
            <ul className={styles.linkList}>
              <li className={styles.hoursItem}>
                <div className={styles.hoursDay}>Monday - Friday</div>
                <div className={styles.hoursTime}>8:00 AM - 6:00 PM</div>
              </li>
              <li className={styles.hoursItem}>
                <div className={styles.hoursDay}>Saturday - Sunday</div>
                <div className={styles.hoursTime}>10:00 AM - 4:00 PM</div>
              </li>
              <li className={styles.aiAvailability}>
                <i className="bi bi-robot"></i>
                <span>AI Assistant available 24/7</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className={styles.footerBottomContainer}>
          <div className={styles.copyright}>
            <i className="bi bi-c-circle me-1"></i>
            {currentYear} UniHelp. All rights reserved.
          </div>
          <div className={styles.legalLinks}>
            {legalLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.path}
                className={styles.legalLink}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
