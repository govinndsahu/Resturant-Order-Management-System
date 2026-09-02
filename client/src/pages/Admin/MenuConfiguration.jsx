import {
  disableLocationValidationApi,
  disableNameValidationApi,
  disablePhoneOtpValidationApi,
  disablePhoneValidationApi,
  enableLocationValidationApi,
  enableNameValidationApi,
  enablePhoneOtpValidationApi,
  enablePhoneValidationApi,
} from "../../apis/configurationApis";
import LocationEnablePopup from "../../components/LocationEnablePopup";
import OtpConfigPopup from "../../components/OtpConfigPopup";
import { useConfig } from "../../contexts/ConfigContext";
import "../../css/menuConfiguration.css";
import { useEffect, useState } from "react";

const MenuConfiguration = () => {
  const { backendUrl, setError, configurations } = useConfig();
  const user = JSON.parse(localStorage.getItem("user"));

  // Use configurations from context as the single source of truth
  const [configs, setConfigs] = useState({});

  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showOtpConfigPopup, setShowOtpConfigPopup] = useState(false);

  // Sync local state with context configurations whenever they change
  useEffect(() => {
    if (configurations && Object.keys(configurations).length > 0) {
      setConfigs(configurations);
    }
  }, [configurations]);

  const handleToggle = async (key) => {
    if (key === "customerNameValidation" && !configs[key]?.doValidate) {
      handleNameValidationConfirm();
      return;
    }

    if (key === "locationValidation" && !configs[key]?.doValidate) {
      setShowLocationPopup(true);
      return;
    }

    if (key === "customerPhoneValidation" && !configs[key]?.doValidate) {
      handlePhoneValidationConfirm();
      return;
    }

    if (key === "phoneOtpValidation" && !configs[key]?.doValidate) {
      setShowOtpConfigPopup(true);
      return;
    }

    if (configs[key]?.doValidate === true && key === "customerNameValidation") {
      handleNameValidationCancel();
      return;
    }

    if (configs[key]?.doValidate === true && key === "locationValidation") {
      handleLocationValidationCancel();
      return;
    }

    if (
      configs[key]?.doValidate === true &&
      key === "customerPhoneValidation"
    ) {
      handlePhoneValidationCancel();
      return;
    }

    if (configs[key]?.doValidate === true && key === "phoneOtpValidation") {
      handleOtpValidationCancel();
      return;
    }

    // For other toggles that don't need API calls — just flip doValidate
    setConfigs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        doValidate: !prev[key]?.doValidate,
      },
    }));
  };

  const handleNameValidationConfirm = async () => {
    try {
      const { data } = await enableNameValidationApi(backendUrl);

      if (data.success) {
        setConfigs((prev) => ({
          ...prev,
          customerNameValidation: {
            ...prev.customerNameValidation,
            doValidate: true,
            data: null,
          },
        }));
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleNameValidationCancel = async () => {
    try {
      const { data } = await disableNameValidationApi(backendUrl);

      if (data.success) {
        setConfigs((prev) => ({
          ...prev,
          customerNameValidation: {
            ...prev.customerNameValidation,
            doValidate: false,
            data: null,
          },
        }));
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleLocationValidationConfirm = async (d) => {
    try {
      const payload = {
        latitude: d.latitude,
        longitude: d.longitude,
        radius: d.radius,
      };

      const { data } = await enableLocationValidationApi(payload, backendUrl);

      if (data.success) {
        setConfigs((prev) => ({
          ...prev,
          locationValidation: {
            ...prev.locationValidation,
            doValidate: true,
            data: payload,
          },
        }));
        setShowLocationPopup(false);
        return true;
      }
    } catch (error) {
      setError(error);
      return false;
    }
  };

  const handleLocationValidationCancel = async () => {
    try {
      const { data } = await disableLocationValidationApi(backendUrl);
      if (data.success) {
        setConfigs((prev) => ({
          ...prev,
          locationValidation: {
            ...prev.locationValidation,
            doValidate: false,
            data: null,
          },
        }));
      }
    } catch (error) {
      setError(error);
    }
  };

  const handlePhoneValidationConfirm = async () => {
    try {
      const { data } = await enablePhoneValidationApi(backendUrl);

      if (data.success) {
        setConfigs((prev) => ({
          ...prev,
          customerPhoneValidation: {
            ...prev.customerPhoneValidation,
            doValidate: true,
          },
        }));
      }
    } catch (error) {
      setError(error);
    }
  };

  const handlePhoneValidationCancel = async () => {
    try {
      const { data } = await disablePhoneValidationApi(backendUrl);

      if (data.success) {
        setConfigs((prev) => ({
          ...prev,
          customerPhoneValidation: {
            ...prev.customerPhoneValidation,
            doValidate: false,
            data: null,
          },
          phoneOtpValidation: {
            ...prev.phoneOtpValidation,
            doValidate: false,
            data: null,
          },
        }));
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleOtpValidationConfirm = async (payload) => {
    try {
      const { data } = await enablePhoneOtpValidationApi(payload, backendUrl);

      if (data.success) {
        setConfigs((prev) => ({
          ...prev,
          customerPhoneValidation: {
            ...prev.customerPhoneValidation,
            doValidate: true,
          },
          phoneOtpValidation: {
            ...prev.phoneOtpValidation,
            doValidate: true,
            data: payload,
          },
        }));
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleOtpValidationCancel = async () => {
    try {
      const { data } = await disablePhoneOtpValidationApi(backendUrl);

      if (data.success) {
        setConfigs((prev) => ({
          ...prev,
          customerPhoneValidation: {
            ...prev.customerPhoneValidation,
            doValidate: false,
            data: null,
          },
          phoneOtpValidation: {
            ...prev.phoneOtpValidation,
            doValidate: false,
            data: null,
          },
        }));
      }
    } catch (error) {
      setError(error);
    }
  };

  const ToggleSwitch = ({ label, description, configKey }) => {
    const isOn = configs[configKey]?.doValidate === true;

    return (
      <div className="mc-toggle-row">
        <div className="mc-toggle-info">
          <span className="mc-toggle-label">{label}</span>
          {description && <span className="mc-toggle-desc">{description}</span>}
        </div>
        <button
          type="button"
          className={`mc-toggle ${isOn ? "mc-toggle-on" : "mc-toggle-off"}`}
          onClick={() => handleToggle(configKey)}
          aria-pressed={isOn}>
          <span className="mc-toggle-knob" />
        </button>
      </div>
    );
  };

  const SectionCard = ({ title, icon, children }) => (
    <div className="mc-section">
      <div className="mc-section-header">
        <div className="mc-section-icon">{icon}</div>
        <h2>{title}</h2>
      </div>
      <div className="mc-section-body">{children}</div>
    </div>
  );

  // Unauthorized state
  if (!user || user?.role < 2) {
    return (
      <div className="cat-unauthorized">
        <div className="cat-unauthorized-content">
          <i className="ri-shield-cross-line"></i>
          <h2>Access Denied</h2>
          <p>You are not authorized to manage categories.</p>
        </div>
      </div>
    );
  }

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
            label="Name Validation"
            description="Check if the customer's name is required or not while ordering."
            configKey="customerNameValidation"
          />
          <ToggleSwitch
            label="Validate Location"
            description="Check if the customer is inside the restaurant or not while ordering."
            configKey="locationValidation"
          />
          <ToggleSwitch
            label="Customer Phone Validation"
            description="Require customers to verify their phone number before placing orders."
            configKey="customerPhoneValidation"
          />
          <ToggleSwitch
            label="Phone OTP Validation"
            description="Send OTP to customer phone for additional order security."
            configKey="phoneOtpValidation"
          />
        </SectionCard>
      </div>

      <LocationEnablePopup
        isOpen={showLocationPopup}
        onClose={() => setShowLocationPopup(false)}
        onConfirm={handleLocationValidationConfirm}
      />

      <OtpConfigPopup
        isOpen={showOtpConfigPopup}
        onClose={() => setShowOtpConfigPopup(false)}
        onEnable={(payload) => handleOtpValidationConfirm(payload, backendUrl)}
      />
    </div>
  );
};

export default MenuConfiguration;
