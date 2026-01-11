import { useState, useEffect, useRef } from "react";
import styles from "./Assistant.module.css";

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your AI Academic Assistant. Ask me anything related to your university or academics.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user's message
    const userMsg = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/assistant/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();

      const botMsg = {
        sender: "bot",
        text: data.answer || "Sorry, I couldn't find an answer for that.",
        source: data.source, // ✅ Track source
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error:", error);
      const botErrorMsg = {
        sender: "bot",
        text: "Oops! Something went wrong. Please try again.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botErrorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="py-5 text-center">
      <h1 className="display-5 fw-bold text-body-emphasis">
        AI Academic Assistant
      </h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead mb-4">
          Get instant help with your academic questions. Ask about any subject
          and receive detailed explanations.
        </p>
      </div>

      <div className={styles.chatContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === "bot"
                ? styles.robocontainer
                : styles.humancontainer
            }
          >
            <div className={styles.robosection}>
              {msg.sender === "bot" && (
                <i className={`bi bi-robot ${styles.roboicon}`}></i>
              )}
              <div
                className={
                  msg.sender === "bot" ? styles.robopara : styles.userpara
                }
              >
                <p>{msg.text}</p>
                <div className={styles.date}>
                  {msg.time}
                  {/* ✅ Show source badge */}
                  {msg.source && (
                    <span className={styles.sourceBadge}>
                      {msg.source === "database" ? "📚 KB" : "🤖 AI"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className={styles.robocontainer}>
            <div className={styles.robosection}>
              <i className={`bi bi-robot ${styles.roboicon}`}></i>
              <div className={styles.robopara}>
                <p className={styles.typing}>Typing...</p>
              </div>
            </div>
          </div>
        )}
        
        <div ref={bottomRef}></div>
      </div>

      <div className={styles.messagecontainer}>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter your query..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isTyping}
        />
        <button 
          className={styles.btn} 
          onClick={handleSend}
          disabled={isTyping}
        >
          <i className={`bi bi-send ${styles.sendicon}`}></i>
        </button>
      </div>
    </div>
  );
}
