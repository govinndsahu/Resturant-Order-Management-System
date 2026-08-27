const LocationErrorMessage = ({ setLocationError }) => {
  return (
    <div id="location-error-overlay" onClick={() => setLocationError(false)}>
      <div id="location-error-card" onClick={(e) => e.stopPropagation()}>
        {/* Top accent bar */}
        <div className="lem-accent-bar"></div>

        {/* Close button */}
        <button
          className="lem-close-btn"
          onClick={() => setLocationError(false)}
          aria-label="Close error message">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Icon */}
        <div className="lem-icon-wrapper">
          <div className="lem-icon-bg">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="lem-title">Location Error</h2>

        {/* Message */}
        <p className="lem-message">Make sure you are inside the restaurant.</p>

        {/* Divider */}
        <div className="lem-divider"></div>

        {/* Info tip */}
        <div className="lem-tip">
          <svg
            width="16"
            height="16"
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
          <span>Enable location services and try again</span>
        </div>

        {/* Action button */}
        <button
          className="lem-action-btn"
          onClick={() => setLocationError(false)}>
          Got it
        </button>
      </div>
    </div>
  );
};

export default LocationErrorMessage;
