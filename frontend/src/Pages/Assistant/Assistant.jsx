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

  // Settings panel state
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    soundEnabled: true,
    fontSize: "medium",
    theme: "light",
    language: "en",
  });

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("aiAssistantSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
        console.log("Settings loaded:", JSON.parse(savedSettings));
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, []);

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
        source: data.source,
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Delete chat - direct clear without confirmation
  const handleDeleteChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Chat history cleared. How can I help you today?",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    // Close settings panel if open
    setShowSettingsPanel(false);
  };

  // Toggle settings panel
  const toggleSettingsPanel = () => {
    setShowSettingsPanel(!showSettingsPanel);
  };

  // Save settings
  const handleSettingChange = (key, value) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    localStorage.setItem("aiAssistantSettings", JSON.stringify(updatedSettings));
    console.log("Settings saved:", updatedSettings);
  };

  return (
    <div className={styles.assistantPage}>
      <div className={styles.assistantContainer}>
        {/* Chat Header */}
        <div className={styles.chatHeader}>
          <div className={styles.headerContent}>
            <div className={styles.aiAvatar}>
              <i className="bi bi-robot"></i>
              <span className={styles.statusDot}></span>
            </div>
            <div className={styles.headerInfo}>
              <h2 className={styles.headerTitle}>AI Academic Assistant</h2>
              <p className={styles.headerStatus}>
                <span className={styles.onlineIndicator}>●</span>
                Online - Ready to help
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button 
              className={styles.headerButton} 
              title="Clear chat"
              onClick={handleDeleteChat}
            >
              <i className="bi bi-trash"></i>
            </button>
            <button 
              className={styles.headerButton} 
              title="Settings"
              onClick={toggleSettingsPanel}
            >
              <i className="bi bi-gear"></i>
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className={styles.chatMessages}>
          <div className={styles.messagesContainer}>
            {/* Welcome Banner */}
            <div className={styles.welcomeBanner}>
              <div className={styles.welcomeIcon}>
                <i className="bi bi-stars"></i>
              </div>
              <h3 className={styles.welcomeTitle}>Welcome to AI Assistant</h3>
              <p className={styles.welcomeText}>
                Get instant help with your academic questions. Ask about any subject
                and receive detailed explanations.
              </p>
              <div className={styles.suggestedQuestions}>
                <button className={styles.suggestedButton}>
                  <i className="bi bi-lightbulb"></i>
                  What courses are available?
                </button>
                <button className={styles.suggestedButton}>
                  <i className="bi bi-lightbulb"></i>
                  How do I submit assignments?
                </button>
                <button className={styles.suggestedButton}>
                  <i className="bi bi-lightbulb"></i>
                  Explain calculus derivatives
                </button>
              </div>
            </div>

            {/* Messages */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.messageWrapper} ${
                  msg.sender === "bot" ? styles.botMessage : styles.userMessage
                }`}
              >
                {msg.sender === "bot" && (
                  <div className={styles.botAvatar}>
                    <i className="bi bi-robot"></i>
                  </div>
                )}
                
                <div className={styles.messageBubble}>
                  <div className={styles.messageContent}>
                    <p className={styles.messageText}>{msg.text}</p>
                  </div>
                  <div className={styles.messageFooter}>
                    <span className={styles.messageTime}>
                      <i className="bi bi-clock"></i>
                      {msg.time}
                    </span>
                    {msg.source && (
                      <span
                        className={`${styles.sourceBadge} ${
                          msg.source === "database"
                            ? styles.sourceDatabase
                            : styles.sourceAI
                        }`}
                      >
                        {msg.source === "database" ? (
                          <>
                            <i className="bi bi-book"></i>
                            Knowledge Base
                          </>
                        ) : (
                          <>
                            <i className="bi bi-stars"></i>
                            AI Generated
                          </>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {msg.sender === "user" && (
                  <div className={styles.userAvatar}>
                    <i className="bi bi-person"></i>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className={`${styles.messageWrapper} ${styles.botMessage}`}>
                <div className={styles.botAvatar}>
                  <i className="bi bi-robot"></i>
                </div>
                <div className={styles.messageBubble}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef}></div>
          </div>
        </div>

        {/* Chat Input */}
        <div className={styles.chatInput}>
          <div className={styles.inputContainer}>
            <button className={styles.attachButton} title="Attach file">
              <i className="bi bi-paperclip"></i>
            </button>
            <textarea
              className={styles.inputField}
              placeholder="Type your question here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              rows="1"
            />
            <button
              className={styles.sendButton}
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              title="Send message"
            >
              {isTyping ? (
                <div className={styles.buttonSpinner}></div>
              ) : (
                <i className="bi bi-send-fill"></i>
              )}
            </button>
          </div>
          <div className={styles.inputFooter}>
            <p className={styles.inputHint}>
              <i className="bi bi-info-circle"></i>
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Settings Side Panel */}
      <div className={`${styles.settingsPanel} ${showSettingsPanel ? styles.settingsPanelOpen : ''}`}>
        <div className={styles.settingsHeader}>
          <h3 className={styles.settingsTitle}>
            <i className="bi bi-gear-fill"></i>
            Settings
          </h3>
          <button className={styles.settingsClose} onClick={toggleSettingsPanel}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className={styles.settingsBody}>
          {/* Notifications Setting */}
          <div className={styles.settingItem}>
            <div className={styles.settingIcon}>
              <i className="bi bi-bell-fill"></i>
            </div>
            <div className={styles.settingContent}>
              <h4>Notifications</h4>
              <p className={styles.settingDescription}>Get notified for new messages</p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          {/* Sound Setting */}
          <div className={styles.settingItem}>
            <div className={styles.settingIcon}>
              <i className="bi bi-volume-up-fill"></i>
            </div>
            <div className={styles.settingContent}>
              <h4>Sound Effects</h4>
              <p className={styles.settingDescription}>Play sounds for messages</p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          {/* Font Size Setting */}
          <div className={styles.settingItem}>
            <div className={styles.settingIcon}>
              <i className="bi bi-fonts"></i>
            </div>
            <div className={styles.settingContent}>
              <h4>Font Size</h4>
              <p className={styles.settingDescription}>Adjust message text size</p>
            </div>
            <select
              className={styles.settingSelect}
              value={settings.fontSize}
              onChange={(e) => handleSettingChange('fontSize', e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* Theme Setting */}
          <div className={styles.settingItem}>
            <div className={styles.settingIcon}>
              <i className="bi bi-palette-fill"></i>
            </div>
            <div className={styles.settingContent}>
              <h4>Theme</h4>
              <p className={styles.settingDescription}>Choose your preferred theme</p>
            </div>
            <select
              className={styles.settingSelect}
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          {/* Language Setting */}
          <div className={styles.settingItem}>
            <div className={styles.settingIcon}>
              <i className="bi bi-translate"></i>
            </div>
            <div className={styles.settingContent}>
              <h4>Language</h4>
              <p className={styles.settingDescription}>Select interface language</p>
            </div>
            <select 
              className={styles.settingSelect}
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="ur">Urdu</option>
              <option value="ar">Arabic</option>
            </select>
          </div>

          {/* Clear Data Setting */}
          <div className={styles.settingItem}>
            <div className={styles.settingIcon}>
              <i className="bi bi-trash-fill"></i>
            </div>
            <div className={styles.settingContent}>
              <h4>Clear All Data</h4>
              <p className={styles.settingDescription}>Delete all chat history</p>
            </div>
            <button className={styles.dangerButton} onClick={handleDeleteChat}>
              <i className="bi bi-trash"></i>
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Overlay when settings panel is open */}
      {showSettingsPanel && (
        <div className={styles.settingsOverlay} onClick={toggleSettingsPanel}></div>
      )}
    </div>
  );
}