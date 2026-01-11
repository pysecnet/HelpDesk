import React from 'react';
import './LoadingSpinner.css';

/**
 * Loading Spinner Component
 * Displays a centered loading indicator with animation
 */
export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner-content">
        <div className="spinner-wrapper">
          <div className="spinner-border spinner-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
}
