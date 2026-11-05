import "../css/errorFallback.css";

const ErrorFallback = ({ type = "load-error", onRetry, onGoHome }) => {
  const isNotFound = type === "not-found";

  return (
    <div className="ef-container">
      <div className="ef-card">
        {/* Animated Illustration */}
        <div className="ef-illustration">
          {isNotFound ? (
            <svg
              className="ef-svg"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="80" fill="#FFF3E0" />
              <path
                d="M65 85C65 85 75 75 85 85C95 95 85 105 85 105"
                stroke="#FF8F00"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M135 85C135 85 125 75 115 85C105 95 115 105 115 105"
                stroke="#FF8F00"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle cx="75" cy="80" r="5" fill="#374151" />
              <circle cx="125" cy="80" r="5" fill="#374151" />
              <path
                d="M90 125C90 125 100 115 110 125"
                stroke="#FF8F00"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M60 140C60 140 80 155 100 155C120 155 140 140 140 140"
                stroke="#FFB74D"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8 8"
              />
              <rect
                x="85"
                y="35"
                width="30"
                height="8"
                rx="4"
                fill="#FFB74D"
                opacity="0.6"
              />
              <rect
                x="55"
                y="50"
                width="20"
                height="6"
                rx="3"
                fill="#FFB74D"
                opacity="0.4"
              />
              <rect
                x="130"
                y="55"
                width="18"
                height="6"
                rx="3"
                fill="#FFB74D"
                opacity="0.4"
              />
            </svg>
          ) : (
            <svg
              className="ef-svg"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="80" fill="#FFEBEE" />
              <path
                d="M100 60V110"
                stroke="#E53935"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <circle cx="100" cy="135" r="8" fill="#E53935" />
              <path
                d="M70 50C70 50 60 70 70 90"
                stroke="#EF5350"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.5"
              />
              <path
                d="M130 50C130 50 140 70 130 90"
                stroke="#EF5350"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.5"
              />
              <rect
                x="85"
                y="35"
                width="30"
                height="8"
                rx="4"
                fill="#EF9A9A"
                opacity="0.6"
              />
              <rect
                x="50"
                y="55"
                width="20"
                height="6"
                rx="3"
                fill="#EF9A9A"
                opacity="0.4"
              />
              <rect
                x="135"
                y="60"
                width="18"
                height="6"
                rx="3"
                fill="#EF9A9A"
                opacity="0.4"
              />
            </svg>
          )}
        </div>

        {/* Content */}
        <h1 className="ef-title">
          {isNotFound ? "Menu Not Found" : "Failed to Load"}
        </h1>
        <p className="ef-message">
          {isNotFound
            ? "We couldn't find the menu you're looking for. The link may be expired, or the ID might be incorrect. Please check the URL or scan the QR code again."
            : "Something went wrong while loading the menu. This could be a temporary network issue or our servers taking a quick break."}
        </p>

        {/* Actions */}
        <div className="ef-actions">
          {onRetry && !isNotFound && (
            <button className="ef-btn ef-btn-primary" onClick={onRetry}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Try Again
            </button>
          )}

          {onGoHome && (
            <button
              className={`ef-btn ${
                isNotFound ? "ef-btn-primary" : "ef-btn-secondary"
              }`}
              onClick={onGoHome}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Go Home
            </button>
          )}
        </div>

        {/* Footer hint */}
        <div className="ef-footer">
          <span className="ef-dot" />
          <p className="ef-footer-text">
            {isNotFound
              ? "Double-check the URL or scan the QR code again"
              : "If this keeps happening, please check your connection"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
