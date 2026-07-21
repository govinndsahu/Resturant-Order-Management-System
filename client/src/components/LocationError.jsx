import React from "react";

const LocationError = ({ getUserLocation, setLocationError }) => {
  return (
    <div
      id="location-error-overlay"
      className="location-error-overlay"
      onClick={(e) => {
        if (e.target.className === "location-error-overlay")
          setLocationError(false);
      }}>
      <div className="location-error-card">
        {/* Top accent bar */}
        <div className="le-accent-bar"></div>

        {/* Close button */}
        <button
          className="le-close-btn"
          onClick={() => setLocationError(false)}
          aria-label="Close">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Icon */}
        <div className="le-icon-wrapper">
          <div className="le-icon-bg">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="le-title">Location Access Required</h2>

        {/* Message */}
        <p className="le-message">
          We need your location to prevent fake orders and ensure you're within
          the restaurant premises.
        </p>

        {/* Divider */}
        <div className="le-divider"></div>

        {/* Info tip */}
        <div className="le-tip">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>Your location data is only used for order validation</span>
        </div>

        {/* Action buttons */}
        <div className="le-actions">
          <button
            className="le-btn-secondary"
            onClick={() => setLocationError(false)}>
            Not Now
          </button>
          <button
            className="le-btn-primary"
            onClick={async (e) => await getUserLocation()}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Allow Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationError;
