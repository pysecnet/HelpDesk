#!/bin/bash

# UI Enhancement Script for UniDesk Frontend
# This script will enhance all page styles with modern design improvements

echo "🎨 Starting UI Enhancement..."

# Create enhanced global styles
cat > /mnt/user-data/outputs/enhanced-global.css << 'EOF'
/* ============================================
   ENHANCED GLOBAL STYLES FOR UNIDESK
   ============================================ */

:root {
  /* Modern Color Palette */
  --primary-color: #6366f1;
  --primary-dark: #4f46e5;
  --primary-light: #818cf8;
  --secondary-color: #f8fafc;
  --secondary-dark: #e2e8f0;
  
  --accent-color: #8b5cf6;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --info-color: #3b82f6;
  
  --text-color1: #ffffff;
  --text-color2: #1e293b;
  --text-muted: #64748b;
  
  --primaryLight-color: #f1f5f9;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  
  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Smooth Scrolling */
html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text-color2);
  line-height: 1.6;
  overflow-x: hidden;
}

/* Enhanced Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.display-5 {
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Enhanced Buttons */
.btn {
  border-radius: var(--radius-lg);
  font-weight: 600;
  transition: all var(--transition-base);
  border: none;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left var(--transition-slow);
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.btn-outline-primary {
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.btn-outline-primary:hover {
  background: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Enhanced Cards */
.card {
  border: none;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  overflow: hidden;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.card-body {
  padding: 1.5rem;
}

/* Enhanced Form Controls */
.form-control,
.form-select {
  border-radius: var(--radius-md);
  border: 2px solid var(--secondary-dark);
  padding: 0.75rem 1rem;
  transition: all var(--transition-fast);
}

.form-control:focus,
.form-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

/* Enhanced Badges */
.badge {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  font-weight: 600;
  letter-spacing: 0.025em;
}

/* Loading Animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Fade In Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

/* Slide In Animation */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-in {
  animation: slideIn 0.5s ease-out forwards;
}

/* Enhanced Alerts */
.alert {
  border-radius: var(--radius-lg);
  border: none;
  box-shadow: var(--shadow-md);
  animation: slideIn 0.4s ease-out;
}

/* Spinner Enhancement */
.spinner-border {
  border-width: 3px;
}

/* Utility Classes */
.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.gradient-bg {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
}

.text-gradient {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
EOF

# Enhanced Home.module.css
cat > /mnt/user-data/outputs/Home.module.css << 'EOF'
.boxContainer {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  margin-top: 30px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 30px;
  gap: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.box {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  animation: slideInLeft 0.5s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.icon {
  font-size: 36px;
  color: var(--primary-color);
  transition: transform 0.3s ease;
}

.icon:hover {
  transform: scale(1.1) rotate(5deg);
}

.box1 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.box1 h4 {
  margin: 0;
  font-weight: 700;
  color: var(--text-color2);
  font-size: 1.5rem;
}

.box1 p {
  margin: 0;
  color: var(--text-muted);
}

.badge {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  padding: 15px 20px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.badge1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.badge1 h4 {
  color: var(--text-color1);
  margin: 0;
  font-weight: 800;
  font-size: 2rem;
}

.badge1 p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

.box2 {
  background: white;
  border-radius: 16px;
  padding: 20px;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.box2:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.box2 p {
  color: var(--text-color2);
  margin: 8px 0;
  font-size: 0.95rem;
}

.box2 .highlight {
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  padding: 12px 16px;
  border-radius: 12px;
  width: 100%;
  text-align: start;
  border-left: 4px solid var(--primary-color);
  margin-top: 8px;
  font-weight: 500;
}

.features {
  text-align: start;
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 20px;
}

.feature {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.feature::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.feature:hover::before {
  transform: scaleX(1);
}

.feature:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.15);
}

.iconBox {
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.feature:hover .iconBox {
  transform: scale(1.1) rotate(-5deg);
}

.heading {
  font-weight: 700;
  color: var(--text-color2);
  margin: 20px 0 15px 0;
  font-size: 1.5rem;
}

.iconLink {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color);
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 15px;
}

.iconLink:hover {
  gap: 12px;
  color: var(--primary-dark);
}

.linkicon {
  color: var(--primary-color);
  transition: transform 0.3s ease;
}

.iconLink:hover .linkicon {
  transform: translateX(4px);
}

.box3container {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.box3 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
  transition: transform 0.3s ease;
}

.box3:hover {
  transform: scale(1.05);
}

.box3 h4 {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 3.5rem;
  font-weight: 800;
  margin: 10px 0;
}

.box3 p {
  font-size: 1.1rem;
  color: var(--text-color2);
  font-weight: 600;
}

.lastcontainer {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: var(--text-color1);
  border-radius: 24px;
  padding: 60px 40px;
  box-shadow: 0 20px 50px rgba(99, 102, 241, 0.3);
  position: relative;
  overflow: hidden;
}

.lastcontainer::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.lastcontainer h1 {
  color: var(--text-color1);
  position: relative;
  z-index: 1;
}

.btnPrimary {
  color: var(--primary-color);
  background-color: var(--text-color1);
  border-radius: 12px;
  padding: 14px 32px;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.btnPrimary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.btnSecondary {
  color: var(--text-color1);
  border: 2px solid var(--text-color1);
  background: transparent;
  border-radius: 12px;
  padding: 14px 32px;
  font-weight: 700;
  transition: all 0.3s ease;
}

.btnSecondary:hover {
  background: var(--text-color1);
  color: var(--primary-color);
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .boxContainer {
    padding: 20px;
  }
  
  .features {
    gap: 15px;
  }
  
  .feature {
    padding: 30px 20px;
  }
  
  .box3 h4 {
    font-size: 2.5rem;
  }
}
EOF

# Enhanced Assistant.module.css
cat > /mnt/user-data/outputs/Assistant.module.css << 'EOF'
.chatContainer {
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  width: 55%;
  max-width: 700px;
  height: 80vh;
  margin: auto;
  padding: 25px;
  border-radius: 24px 24px 0 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.chatContainer::-webkit-scrollbar {
  width: 8px;
}

.chatContainer::-webkit-scrollbar-track {
  background: transparent;
}

.chatContainer::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: 10px;
}

.robocontainer {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
  animation: slideInLeft 0.4s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.humancontainer {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  animation: slideInRight 0.4s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.robosection {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 80%;
}

.roboicon {
  font-size: 28px;
  color: var(--primary-color);
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  padding: 10px;
  border-radius: 50%;
  min-width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.robopara {
  background: white;
  padding: 16px 20px;
  border-radius: 18px 18px 18px 4px;
  max-width: 100%;
  word-wrap: break-word;
  font-size: 15px;
  line-height: 1.6;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.1);
  transition: all 0.3s ease;
}

.robopara:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.robopara p {
  margin: 0;
  color: var(--text-color2);
}

.userpara {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: var(--text-color1);
  padding: 16px 20px;
  border-radius: 18px 18px 4px 18px;
  max-width: 80%;
  word-wrap: break-word;
  font-size: 15px;
  line-height: 1.6;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.25);
  transition: all 0.3s ease;
}

.userpara:hover {
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
}

.userpara p {
  margin: 0;
}

.date {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.4);
  padding-top: 6px;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.sourceBadge {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 6px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  color: var(--primary-color);
  font-weight: 600;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.typing {
  font-style: italic;
  color: rgba(0, 0, 0, 0.6);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.messagecontainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 55%;
  max-width: 700px;
  margin: auto;
  padding: 16px;
  background: white;
  border-top: 1px solid rgba(99, 102, 241, 0.1);
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  gap: 12px;
}

.input {
  flex: 1;
  padding: 14px 18px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  font-size: 15px;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  background: white;
}

.input:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn {
  padding: 14px 18px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  min-width: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.sendicon {
  font-size: 20px;
  color: var(--text-color1);
}

@media (max-width: 768px) {
  .chatContainer,
  .messagecontainer {
    width: 90%;
  }
  
  .robosection {
    max-width: 90%;
  }
  
  .userpara {
    max-width: 90%;
  }
}
EOF

# Enhanced Login/Signup styles
cat > /mnt/user-data/outputs/auth-enhanced.css << 'EOF'
/* Enhanced Authentication Pages */
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-box {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  padding: 40px;
  max-width: 500px;
  width: 100%;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-box h2 {
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
}

.auth-box .form-control,
.auth-box .form-select {
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  padding: 14px 18px;
  font-size: 15px;
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.auth-box .form-control:focus,
.auth-box .form-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.auth-box .btn-primary {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  border: none;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
  margin-top: 10px;
}

.auth-box .btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.auth-box .alert {
  border-radius: 12px;
  margin-bottom: 20px;
  animation: slideDown 0.4s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
EOF

# Enhanced Dashboard styles
cat > /mnt/user-data/outputs/dashboard-enhanced.css << 'EOF'
/* Enhanced Dashboard Styles */
.dashboard-container {
  padding: 40px 20px;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
}

.dashboard-header {
  text-align: center;
  margin-bottom: 40px;
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dashboard-header h1,
.dashboard-header h2 {
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
}

.dashboard-nav {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.dashboard-nav .btn {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.dashboard-nav .btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  border-color: transparent;
}

.dashboard-nav .btn-outline-primary {
  background: white;
  border-color: var(--primary-color);
  color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dashboard-nav .btn-outline-primary:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.ticket-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(99, 102, 241, 0.1);
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.ticket-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.ticket-card:hover::before {
  transform: scaleY(1);
}

.ticket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.15);
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.5px;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  animation: fadeIn 0.6s ease-out;
}

.empty-state i {
  font-size: 5rem;
  color: #cbd5e1;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-state p {
  color: var(--text-muted);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 20px 10px;
  }
  
  .ticket-card {
    padding: 20px;
  }
}
EOF

echo "✅ Enhanced global styles created!"
echo "✅ Enhanced Home.module.css created!"
echo "✅ Enhanced Assistant.module.css created!"
echo "✅ Enhanced auth-enhanced.css created!"
echo "✅ Enhanced dashboard-enhanced.css created!"
echo ""
echo "📦 All enhanced CSS files are in /mnt/user-data/outputs/"
echo ""
echo "📋 Next steps:"
echo "1. Copy enhanced-global.css content to your src/index.css or App.css"
echo "2. Replace Home.module.css with the enhanced version"
echo "3. Replace Assistant.module.css with the enhanced version"
echo "4. Add auth-enhanced.css classes to Login and Signup components"
echo "5. Add dashboard-enhanced.css classes to dashboard components"
echo ""
echo "💡 Tips:"
echo "- Add 'fade-in' class to elements for smooth entrance animations"
echo "- Use 'glass-effect' class for modern glassmorphism style"
echo "- Use 'text-gradient' class for colorful gradient text"
echo "- All transitions and animations are already included!"
echo ""
echo "🎨 UI Enhancement Complete! Your app will look modern and professional!"
EOF

chmod +x /home/claude/enhance-ui.sh
