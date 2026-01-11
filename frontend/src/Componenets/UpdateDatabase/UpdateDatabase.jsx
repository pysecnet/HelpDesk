import { useState } from "react";
import API_URL from "../../api";
import styles from "./UpdateDatabase.module.css";

export default function UpdateDatabase() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleAddQA = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!question.trim() || !answer.trim()) {
      setMessage("Both question and answer are required.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/assistant/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question, answer }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("FAQ added successfully to the AI knowledge base!");
        setMessageType("success");
        setQuestion("");
        setAnswer("");
      } else {
        setMessage(data.message || "Failed to add FAQ. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error. Please try again later.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuestion("");
    setAnswer("");
    setMessage("");
    setMessageType("");
  };

  return (
    <div className={styles.databasePage}>
      <div className={styles.databaseContainer}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.headerIcon}>
            <i className="bi bi-database-add"></i>
          </div>
          <h2 className={styles.headerTitle}>Update AI Knowledge Base</h2>
          <p className={styles.headerSubtitle}>
            Add new questions and answers to enhance the AI Assistant's ability to help students
          </p>
        </div>

        {/* Info Cards */}
        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <i className="bi bi-lightbulb"></i>
            </div>
            <div className={styles.infoContent}>
              <h4>Create Quality Content</h4>
              <p>Write clear, concise questions and comprehensive answers</p>
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <i className="bi bi-robot"></i>
            </div>
            <div className={styles.infoContent}>
              <h4>Improve AI Responses</h4>
              <p>Help the AI provide better answers to student queries</p>
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <i className="bi bi-graph-up"></i>
            </div>
            <div className={styles.infoContent}>
              <h4>Build Knowledge</h4>
              <p>Expand the database with commonly asked questions</p>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`${styles.messageAlert} ${
              messageType === "success" ? styles.alertSuccess : styles.alertError
            }`}
          >
            <i
              className={`bi ${
                messageType === "success"
                  ? "bi-check-circle-fill"
                  : "bi-exclamation-circle-fill"
              }`}
            ></i>
            <span>{message}</span>
          </div>
        )}

        {/* Form Section */}
        <div className={styles.formSection}>
          <form onSubmit={handleAddQA} className={styles.addForm}>
            <div className={styles.formGrid}>
              {/* Question Input */}
              <div className={styles.formGroup}>
                <label htmlFor="question" className={styles.formLabel}>
                  <i className="bi bi-question-circle"></i>
                  Question
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="question"
                    className={styles.input}
                    placeholder="e.g., What is the deadline for course registration?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className={styles.inputHint}>
                  <i className="bi bi-info-circle"></i>
                  <span>Enter a clear, specific question that students might ask</span>
                </div>
              </div>

              {/* Answer Input */}
              <div className={styles.formGroup}>
                <label htmlFor="answer" className={styles.formLabel}>
                  <i className="bi bi-chat-left-text"></i>
                  Answer
                </label>
                <div className={styles.inputWrapper}>
                  <textarea
                    id="answer"
                    className={styles.textarea}
                    rows="6"
                    placeholder="Provide a detailed, helpful answer to the question..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={loading}
                  ></textarea>
                </div>
                <div className={styles.inputHint}>
                  <i className="bi bi-info-circle"></i>
                  <span>Write a comprehensive answer that fully addresses the question</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClear}
                disabled={loading || (!question && !answer)}
              >
                <i className="bi bi-x-circle"></i>
                <span>Clear Form</span>
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading || !question.trim() || !answer.trim()}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    <span>Adding to Database...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-circle"></i>
                    <span>Add to Knowledge Base</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className={styles.tipsSection}>
          <h3 className={styles.tipsTitle}>
            <i className="bi bi-journal-text"></i>
            Best Practices
          </h3>
          <div className={styles.tipsList}>
            <div className={styles.tipItem}>
              <i className="bi bi-check2-circle"></i>
              <div className={styles.tipContent}>
                <h5>Be Specific</h5>
                <p>Write questions that target specific information needs</p>
              </div>
            </div>
            <div className={styles.tipItem}>
              <i className="bi bi-check2-circle"></i>
              <div className={styles.tipContent}>
                <h5>Stay Current</h5>
                <p>Ensure answers reflect the most up-to-date information</p>
              </div>
            </div>
            <div className={styles.tipItem}>
              <i className="bi bi-check2-circle"></i>
              <div className={styles.tipContent}>
                <h5>Use Clear Language</h5>
                <p>Avoid jargon and write in simple, understandable terms</p>
              </div>
            </div>
            <div className={styles.tipItem}>
              <i className="bi bi-check2-circle"></i>
              <div className={styles.tipContent}>
                <h5>Include Examples</h5>
                <p>When relevant, provide examples to clarify your answers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
