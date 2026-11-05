import "../css/noDataPopup.css";

const NoDataPopup = ({
  isOpen,
  onClose,
  message = "No data available right now. Try tomorrow and don't forget to check back later otherwise you might lost your data because we clean our database daily to remove all previous day's data and keep the current day's data.",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="ndp-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="ndp-card">
        <button className="ndp-close" onClick={onClose} aria-label="Close">
          <i className="ri-close-line"></i>
        </button>

        <div className="ndp-illustration">
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="50" fill="#FFF8E1" />
            <circle cx="45" cy="52" r="4" fill="#F59E0B" />
            <circle cx="75" cy="52" r="4" fill="#F59E0B" />
            <path
              d="M48 72C48 72 54 78 60 78C66 78 72 72 72 72"
              stroke="#F59E0B"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M35 40C35 40 30 50 35 60"
              stroke="#FDE68A"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M85 40C85 40 90 50 85 60"
              stroke="#FDE68A"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </div>

        <h3 className="ndp-title">Oops!</h3>
        <p className="ndp-message">{message}</p>

        <button className="ndp-btn" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
};

export default NoDataPopup;
