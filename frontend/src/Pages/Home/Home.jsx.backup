import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const handlePrimaryClick = () => {
    navigate("/ai-assistant");
  };

  const handleSecondaryClick = () => {
    if (user) {
      const dashboardMap = {
        student: "/student-dashboard",
        admin: "/admin-dashboard",
        department: "/department-dashboard",
      };
      navigate(dashboardMap[user.role] || "/student-dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="py-5 my-4 text-center">
      <div className="py-5 text-center">
        <h1 className="display-5 fw-bold text-body-emphasis">
          Get instant help with your academic <div>queries and studies</div>
        </h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            Access AI-powered academic assistant and connect with university
            staff through our comprehensive support system designed for student
            success.
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <button
              type="button"
              className="btn btn-primary btn-lg px-4 gap-3"
              onClick={handlePrimaryClick}
            >
              Try AI Assistant
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-lg px-4"
              onClick={handleSecondaryClick}
            >
              {user ? "Go to Dashboard" : "Get Started"}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`col-lg-6 mx-auto position-relative ${styles.boxContainer}`}
      >
        <div className={`${styles.box}`}>
          <i className={`bi bi-chat-dots ${styles.icon}`}></i>
          <div className={`${styles.box1}`}>
            <h4>AI Assistant</h4>
            <p>Ready to help</p>
            <span
              className={`position-absolute top-0 start-100 translate-middle badge ${styles.badge}`}
            >
              <div className={`${styles.badge1}`}>
                <h4>24/7</h4>
                <p>available</p>
              </div>
              <span className="visually-hidden">unread messages</span>
            </span>
          </div>
        </div>
        <div className={`${styles.box2}`}>
          <p>"How do I calculate derivatives in calculus?"</p>
          <p className={`${styles.highlight}`}>
            I'll help you understand derivatives step by step...
          </p>
        </div>
      </div>

      <div className="py-5 text-center">
        <h1 className="display-5 fw-bold text-body-emphasis">
          Everything you need for academic success
        </h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            Our comprehensive platform combines AI technology with human
            expertise to provide instant and personalized support.
          </p>
        </div>
      </div>

      <div
        className={`row g-4 py-5 row-cols-1 row-cols-lg-3 ${styles.features}`}
      >
        <div className={`feature col ${styles.feature}`}>
          <div
            className={`feature-icon d-inline-flex align-items-center justify-content-center fs-2 mb-3 ${styles.iconBox}`}
          >
            <i className={`bi bi-robot ${styles.icon}`}></i>
          </div>
          <h3 className={`fs-2 text-body-emphasis my-3 ${styles.heading}`}>
            Instant AI Assistant
          </h3>
          <p className="my-3">
            Get immediate answers to academic questions with our advanced AI
            chatbot trained on university curriculum.
          </p>
          <a
            href="/ai-assistant"
            className={`icon-link my-3 ${styles.iconLink}`}
          >
            Try AI chat
            <i className={`bi bi-arrow-right ${styles.linkicon}`}></i>
          </a>
        </div>

        <div className={`feature col ${styles.feature}`}>
          <div
            className={`feature-icon d-inline-flex align-items-center justify-content-center fs-2 mb-3 ${styles.iconBox}`}
          >
            <i className={`bi bi-ticket-perforated ${styles.icon}`}></i>
          </div>
          <h3 className={`fs-2 text-body-emphasis my-3 ${styles.heading}`}>
            Support Tickets
          </h3>
          <p className="my-3">
            Submit tickets for complex issues and get personalized assistance
            from qualified staff members.
          </p>
          <a
            href={user ? "/student-dashboard" : "/signup"}
            className={`icon-link my-3 ${styles.iconLink}`}
          >
            Submit ticket
            <i className={`bi bi-arrow-right ${styles.linkicon}`}></i>
          </a>
        </div>

        <div className={`feature col ${styles.feature}`}>
          <div
            className={`feature-icon d-inline-flex align-items-center justify-content-center fs-2 mb-3 ${styles.iconBox}`}
          >
            <i className={`bi bi-clock-history ${styles.icon}`}></i>
          </div>
          <h3 className={`fs-2 text-body-emphasis my-3 ${styles.heading}`}>
            Track Progress
          </h3>
          <p className="my-3">
            Monitor your ticket status and receive real-time updates on your
            support requests.
          </p>
          <a
            href={user ? "/student-dashboard" : "/signup"}
            className={`icon-link my-3 ${styles.iconLink}`}
          >
            View dashboard
            <i className={`bi bi-arrow-right ${styles.linkicon}`}></i>
          </a>
        </div>
      </div>

      <div
        className={`row g-4 py-5 my-5 row-cols-1 row-cols-lg-4 ${styles.box3container}`}
      >
        <div className={`feature col ${styles.box3}`}>
          <h4 className="my-1">10K+</h4>
          <p className="my-1">Questions Answered</p>
        </div>
        <div className={`feature col ${styles.box3}`}>
          <h4 className="my-1">500+</h4>
          <p className="my-1">Tickets Resolved</p>
        </div>
        <div className={`feature col ${styles.box3}`}>
          <h4 className="my-1">24/7</h4>
          <p className="my-1">AI Availability</p>
        </div>
        <div className={`feature col ${styles.box3}`}>
          <h4 className="my-1">95%</h4>
          <p className="my-1">Satisfaction Rate</p>
        </div>
      </div>

      <div className="py-5 text-center">
        <h1 className="display-5 fw-bold text-body-emphasis">How it works</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            Getting help is simple and straightforward. Choose your preferred
            method and get the support you need.
          </p>
        </div>
      </div>

      <div className="row g-0 text-center my-3">
        <div className="col-sm-6 col-md-6">
          <h3>AI Assistant</h3>
          <ol className={`text-start my-5`}>
            <li>
              <h4>Ask Your Question</h4>
              <p>
                Type your academic question in natural language - no special
                formatting required.
              </p>
            </li>
            <li>
              <h4>Get Instant Response</h4>
              <p>
                Receive detailed explanations, step-by-step solutions, and
                relevant examples immediately.
              </p>
            </li>
            <li>
              <h4>Continuous Learning</h4>
              <p>
                Ask follow-up questions and dive deeper into topics with our
                conversational AI.
              </p>
            </li>
          </ol>
        </div>
        <div className="col-6 col-md-6">
          <h3>Staff Assistance</h3>
          <ol className={`text-start my-5`}>
            <li>
              <h4>Submit Request</h4>
              <p>
                Fill out a detailed form describing your issue and the type of
                assistance needed.
              </p>
            </li>
            <li>
              <h4>Get Assigned</h4>
              <p>
                Your ticket is automatically routed to the appropriate
                department for quick resolution.
              </p>
            </li>
            <li>
              <h4>Receive Support</h4>
              <p>
                Get personalized assistance from qualified staff members and
                track progress.
              </p>
            </li>
          </ol>
        </div>
      </div>

      <div
        className={`py-5 text-center container-fluid ${styles.lastcontainer}`}
      >
        <h1 className={`display-5 fw-bold`}>
          Ready to get the help you need?
        </h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            Join thousands of students who are already getting the support they
            need to succeed academically.
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <button
              type="button"
              className={`btn btn-lg px-4 gap-3 ${styles.btnPrimary}`}
              onClick={handlePrimaryClick}
            >
              Start Chatting
            </button>
            <button
              type="button"
              className={`btn btn-lg px-4 ${styles.btnSecondary}`}
              onClick={handleSecondaryClick}
            >
              {user ? "My Dashboard" : "Sign Up Free"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
