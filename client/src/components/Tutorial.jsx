import React, { useEffect } from "react";

const Tutorial = ({ setShowTutorial }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowTutorial(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setShowTutorial]);

  const steps = [
    {
      number: "1",
      title: "Open Browser Settings",
      description: "Tap the menu icon (⋮) in your browser toolbar",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
    {
      number: "2",
      title: "Enable Location Permission",
      description: "Go to Site Settings → Permissions → Toggle Location ON",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      number: "3",
      title: "Reload the Page",
      description: "Pull down to refresh or tap the reload button",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      ),
    },
  ];

  return (
    <div
      id="tutorial-overlay"
      className="tutorial-overlay"
      onClick={(e) => {
        if (e.target.className === "tutorial-overlay") setShowTutorial(false);
      }}>
      <div className="tutorial-card">
        {/* Close button */}
        <button
          className="tut-close-btn"
          onClick={() => setShowTutorial(false)}
          aria-label="Close tutorial">
          <svg
            width="20"
            height="20"
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

        {/* Header */}
        <div className="tut-header">
          <div className="tut-header-icon">
            <svg
              width="24"
              height="24"
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
          </div>
          <div>
            <h2 className="tut-title">Enable Location Access</h2>
            <p className="tut-subtitle">
              Follow these steps to allow location on your mobile browser
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="tut-steps">
          {steps.map((step, index) => (
            <div key={index} className="tut-step">
              <div className="tut-step-left">
                <div className="tut-step-number">{step.number}</div>
                {index < steps.length - 1 && (
                  <div className="tut-step-line"></div>
                )}
              </div>
              <div className="tut-step-content">
                <div className="tut-step-icon">{step.icon}</div>
                <div className="tut-step-text">
                  <h3 className="tut-step-title">{step.title}</h3>
                  <p className="tut-step-desc">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Image reference */}
        <div className="tut-image-wrapper">
          <img
            src="/tutorial.jpg"
            alt="Location permission tutorial"
            className="tut-image"
          />
        </div>

        {/* Footer */}
        <div className="tut-footer">
          <button
            className="tut-btn-secondary"
            onClick={() => setShowTutorial(false)}>
            Skip for Now
          </button>
          <button
            className="tut-btn-primary"
            onClick={() => {
              window.location.reload();
            }}>
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
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
