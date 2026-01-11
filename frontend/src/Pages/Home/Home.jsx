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

  const stats = [
    { value: "10K+", label: "Questions Answered", icon: "bi-chat-quote" },
    { value: "500+", label: "Tickets Resolved", icon: "bi-patch-check" },
    { value: "24/7", label: "AI Availability", icon: "bi-clock" },
    { value: "95%", label: "Satisfaction Rate", icon: "bi-star" },
  ];

  const features = [
    {
      icon: "bi-robot",
      title: "Instant AI Assistant",
      description:
        "Get immediate answers to academic questions with our advanced AI chatbot trained on university curriculum and educational best practices.",
      link: "/ai-assistant",
      linkText: "Try AI chat",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: "bi-ticket-perforated",
      title: "Support Tickets",
      description:
        "Submit tickets for complex issues and get personalized assistance from qualified staff members who understand your needs.",
      link: user ? "/student-dashboard" : "/signup",
      linkText: "Submit ticket",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      icon: "bi-clock-history",
      title: "Track Progress",
      description:
        "Monitor your ticket status and receive real-time updates on your support requests with our intuitive dashboard.",
      link: user ? "/student-dashboard" : "/signup",
      linkText: "View dashboard",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Abstract Background Elements */}
      <div className={styles.backgroundDecor}>
        <div className={styles.decorCircle1}></div>
        <div className={styles.decorCircle2}></div>
        <div className={styles.decorCircle3}></div>
      </div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <i className="bi bi-stars"></i>
            <span>Powered by Advanced AI</span>
          </div>
          
          <h1 className={styles.heroTitle}>
            Get instant help with your
            <span className={styles.titleAccent}> academic queries</span>
            <br />
            and studies
          </h1>
          
          <p className={styles.heroSubtitle}>
            Access AI-powered academic assistant and connect with university
            staff through our comprehensive support system designed for student
            success and excellence.
          </p>
          
          <div className={styles.heroButtons}>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={handlePrimaryClick}
            >
              <i className="bi bi-chat-dots me-2"></i>
              Try AI Assistant
            </button>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={handleSecondaryClick}
            >
              {user ? "Go to Dashboard" : "Get Started"}
              <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>

        {/* Interactive Demo Card */}
        <div className={styles.demoCard}>
          <div className={styles.demoHeader}>
            <div className={styles.demoHeaderLeft}>
              <div className={styles.aiAvatar}>
                <i className="bi bi-robot"></i>
              </div>
              <div>
                <h4>AI Assistant</h4>
                <div className={styles.statusBadge}>
                  <span className={styles.statusDot}></span>
                  <span>Online - Ready to help</span>
                </div>
              </div>
            </div>
            <div className={styles.badge24}>
              <span>24/7</span>
            </div>
          </div>
          
          <div className={styles.demoMessages}>
            <div className={styles.messageUser}>
              <p>"How do I calculate derivatives in calculus?"</p>
            </div>
            <div className={styles.messageAI}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>
                I'll help you understand derivatives step by step. Let's start
                with the basic concept...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className={styles.statCard}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.statIcon}>
                <i className={`bi ${stat.icon}`}></i>
              </div>
              <h3 className={styles.statValue}>{stat.value}</h3>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Everything you need for
            <span className={styles.titleAccent}> academic success</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Our comprehensive platform combines AI technology with human
            expertise to provide instant and personalized support tailored to
            your learning journey.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={styles.featureCard}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={styles.featureIconWrapper}>
                <div className={`${styles.featureIcon} ${styles[feature.gradient]}`}>
                  <i className={`bi ${feature.icon}`}></i>
                </div>
              </div>
              
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
              
              <a href={feature.link} className={styles.featureLink}>
                {feature.linkText}
                <i className="bi bi-arrow-right"></i>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorksSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            How it <span className={styles.titleAccent}>works</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Getting help is simple and straightforward. Choose your preferred
            method and get the support you need in minutes.
          </p>
        </div>

        <div className={styles.howItWorksGrid}>
          <div className={styles.methodCard}>
            <div className={styles.methodHeader}>
              <div className={styles.methodIcon}>
                <i className="bi bi-robot"></i>
              </div>
              <h3>AI Assistant</h3>
            </div>
            
            <div className={styles.stepsList}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h4>Ask Your Question</h4>
                  <p>
                    Type your academic question in natural language - no special
                    formatting required.
                  </p>
                </div>
              </div>
              
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h4>Get Instant Response</h4>
                  <p>
                    Receive detailed explanations, step-by-step solutions, and
                    relevant examples immediately.
                  </p>
                </div>
              </div>
              
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h4>Continuous Learning</h4>
                  <p>
                    Ask follow-up questions and dive deeper into topics with our
                    conversational AI.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.methodCard}>
            <div className={styles.methodHeader}>
              <div className={styles.methodIcon}>
                <i className="bi bi-people"></i>
              </div>
              <h3>Staff Assistance</h3>
            </div>
            
            <div className={styles.stepsList}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h4>Submit Request</h4>
                  <p>
                    Fill out a detailed form describing your issue and the type of
                    assistance needed.
                  </p>
                </div>
              </div>
              
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h4>Get Assigned</h4>
                  <p>
                    Your ticket is automatically routed to the appropriate
                    department for quick resolution.
                  </p>
                </div>
              </div>
              
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h4>Receive Support</h4>
                  <p>
                    Get personalized assistance from qualified staff members and
                    track progress in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <div className={styles.ctaIcon}>
            <i className="bi bi-mortarboard"></i>
          </div>
          
          <h2 className={styles.ctaTitle}>
            Ready to get the help you need?
          </h2>
          
          <p className={styles.ctaSubtitle}>
            Join thousands of students who are already getting the support they
            need to succeed academically and reach their full potential.
          </p>
          
          <div className={styles.ctaButtons}>
            <button
              type="button"
              className={styles.ctaBtnPrimary}
              onClick={handlePrimaryClick}
            >
              <i className="bi bi-chat-dots me-2"></i>
              Start Chatting Now
            </button>
            <button
              type="button"
              className={styles.ctaBtnSecondary}
              onClick={handleSecondaryClick}
            >
              {user ? "My Dashboard" : "Sign Up Free"}
              <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
