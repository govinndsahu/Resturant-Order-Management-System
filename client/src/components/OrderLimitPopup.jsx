import "../css/orderLimitPopup.css";

const OrderLimitPopup = ({
  isOpen,
  onClose,
  statusUrl = "https://dgdine.in/dashboard/status",
  target = "Order",
  message = "Your menu has hit the maximum order limit for this billing cycle.",
}) => {
  if (!isOpen) return null;

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div
      className="olp-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="olp-card">
        <button className="olp-close" onClick={onClose} aria-label="Close">
          <i className="ri-close-line"></i>
        </button>

        <div className="olp-illustration">
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="50" fill="#FEF3C7" />
            <path
              d="M60 35V65"
              stroke="#F59E0B"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="60" cy="80" r="5" fill="#F59E0B" />
            <path
              d="M40 30C40 30 35 45 40 55"
              stroke="#FDE68A"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M80 30C80 30 85 45 80 55"
              stroke="#FDE68A"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.6"
            />
            <rect
              x="52"
              y="22"
              width="16"
              height="5"
              rx="2.5"
              fill="#FDE68A"
              opacity="0.5"
            />
          </svg>
        </div>

        <h3 className="olp-title"> {target} Limit Reached</h3>
        <p className="olp-subtitle">{message}</p>

        <div className="olp-roles">
          {target === "Order" && (
            <>
              <div className="olp-role olp-role-customer">
                <div className="olp-role-icon">
                  <i className="ri-user-3-line"></i>
                </div>
                <div className="olp-role-text">
                  <strong>Customer?</strong>
                  <span>Please inform the owner about this.</span>
                </div>
              </div>

              <div className="olp-divider">
                <span>OR</span>
              </div>
            </>
          )}

          <div className="olp-role olp-role-owner">
            <div className="olp-role-icon">
              <i className="ri-shield-user-line"></i>
            </div>
            <div className="olp-role-text">
              <strong>Owner?</strong>
              <span>
                {
                  target === "Order"
                    ? "Please upgrade your plan to increase the order limit."
                    : "Please upgrade your plan to increase the item limit."
                }
              </span>
            </div>
          </div>
        </div>

        {user?.role === 2 ? (
          <a
            href={statusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="olp-btn olp-btn-primary">
            <i className="ri-external-link-line"></i>
            Check Plan Status
          </a>
        ) : null}

        <button className="olp-btn olp-btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderLimitPopup;
