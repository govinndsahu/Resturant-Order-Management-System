import "../css/AlreadyExistPopup.css";

const AlreadyExistPopup = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="popup-title">Already Exists</h3>
        <p className="popup-message">{message}</p>
        <button className="popup-close-btn" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
};

export default AlreadyExistPopup;
