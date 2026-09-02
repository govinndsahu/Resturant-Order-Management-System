import { useState } from "react";
import "../css/otpConfigPopup.css";

const OtpConfigPopup = ({ isOpen, onClose, onEnable }) => {
  const [formData, setFormData] = useState({
    widgetId: "",
    tokenAuth: "",
    authKey: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleEnable = async (e) => {
    e.preventDefault();

    if (
      !formData.widgetId.trim() ||
      !formData.tokenAuth.trim() ||
      !formData.authKey.trim()
    ) {
      setError("All fields are required to enable Phone OTP Validation.");
      return;
    }

    setLoading(true);
    // Simulate API call to save credentials and enable OTP
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);

    onEnable(formData);
    onClose();
  };

  const handleContact = () => {
    // Opens WhatsApp with a pre-filled message
    window.open(
      "whatsapp://send?phone=+917067738849&text=Hello%20Support,%20I%20need%20assistance%20with%20enabling%20Phone%20OTP%20Validation.",
      "_blank",
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="ocp-overlay"
      onClick={(e) => e.target.className === "ocp-overlay" && onClose()}>
      <div className="ocp-card">
        {/* Close button */}
        <button className="ocp-close-btn" onClick={onClose} aria-label="Close">
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

        {/* Header */}
        <div className="ocp-header">
          <div className="ocp-header-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h2 className="ocp-title">Enable Phone OTP Validation</h2>
            <p className="ocp-subtitle">
              Secure your orders with one-time password verification
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="ocp-info-banner">
          <div className="ocp-info-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <p className="ocp-info-text">
            <strong>Important:</strong> Enabling this feature requires proper
            configuration. Please contact our team for guidance before
            proceeding. Do not enter any unknown values.
          </p>
        </div>

        {/* Contact CTA */}
        <div className="ocp-contact-section">
          <p className="ocp-contact-text">Need help setting this up?</p>
          <button
            type="button"
            className="ocp-contact-btn"
            onClick={handleContact}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            Contact Support
          </button>
        </div>

        {/* Form */}
        <form className="ocp-form" onSubmit={handleEnable}>
          <div className="ocp-field">
            <label className="ocp-label">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              Widget ID
            </label>
            <input
              type="text"
              name="widgetId"
              className="ocp-input"
              placeholder="Enter your Widget ID"
              value={formData.widgetId}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="ocp-field">
            <label className="ocp-label">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Token Auth
            </label>
            <input
              type="text"
              name="tokenAuth"
              className="ocp-input"
              placeholder="Enter your Token Auth"
              value={formData.tokenAuth}
              onChange={handleChange}
            />
          </div>

          <div className="ocp-field">
            <label className="ocp-label">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
              Auth Key
            </label>
            <input
              type="password"
              name="authKey"
              className="ocp-input"
              placeholder="Enter your Auth Key"
              value={formData.authKey}
              onChange={handleChange}
            />
          </div>

          {error && <span className="ocp-error">{error}</span>}

          <div className="ocp-warning">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Do not enter any unknown values. Incorrect credentials will fail OTP
            delivery.
          </div>

          <button type="submit" className="ocp-btn-primary" disabled={loading}>
            {loading ? (
              <span className="ocp-btn-spinner">
                <span className="ocp-spinner-ring"></span>
                Enabling...
              </span>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Enable OTP Validation
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpConfigPopup;
