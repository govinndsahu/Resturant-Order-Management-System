import "../../css/menuConfiguration.css";
import React, { useState } from "react";

const MenuConfiguration = () => {
  const [configs, setConfigs] = useState({ validateLocation: false });

  const handleToggle = (key) => {
    setConfigs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const ToggleSwitch = ({ label, description, configKey }) => (
    <div className="mc-toggle-row">
      <div className="mc-toggle-info">
        <span className="mc-toggle-label">{label}</span>
        {description && <span className="mc-toggle-desc">{description}</span>}
      </div>
      <button
        type="button"
        className={`mc-toggle ${configs[configKey] ? "mc-toggle-on" : "mc-toggle-off"}`}
        onClick={() => handleToggle(configKey)}
        aria-pressed={configs[configKey]}>
        <span className="mc-toggle-knob" />
      </button>
    </div>
  );

  const SectionCard = ({ title, icon, children }) => (
    <div className="mc-section">
      <div className="mc-section-header">
        <div className="mc-section-icon">{icon}</div>
        <h2>{title}</h2>
      </div>
      <div className="mc-section-body">{children}</div>
    </div>
  );

  return (
    <div id="menu-config">
      {/* Header */}
      <div className="mc-header">
        <div className="mc-header-content">
          <div className="mc-header-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div className="mc-header-text">
            <h1>Menu Configuration</h1>
            <p>Toggle features and customize your menu experience</p>
          </div>
        </div>
      </div>

      <div className="mc-body">
        <SectionCard
          title="Configurations"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }>
          <ToggleSwitch
            label="Validate Location"
            description="Check if the customer is inside the restaurant or not while ordering."
            configKey="validateLocation"
          />
        </SectionCard>
      </div>
    </div>
  );
};

export default MenuConfiguration;
