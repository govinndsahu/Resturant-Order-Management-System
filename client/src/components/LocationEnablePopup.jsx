import React, { useState, useEffect } from "react";

const LocationEnablePopup = ({
  isOpen,
  onClose,
  onConfirm,
  defaultRadius = 50,
}) => {
  const [radius, setRadius] = useState(defaultRadius);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRadius(defaultRadius);
      setError("");
      setLoading(false);
    }
  }, [isOpen, defaultRadius]);

  const handleRadiusChange = (e) => {
    const value = e.target.value;
    setRadius(value);
    setError("");
  };

  const handleConfirm = async () => {
    const numRadius = parseInt(radius, 10);

    if (!radius || isNaN(numRadius)) {
      setError("Please enter a valid radius");
      return;
    }

    if (numRadius < 5) {
      setError("Radius must be at least 5 meters");
      return;
    }

    if (numRadius > 1000) {
      setError("Radius cannot exceed 1,000 meters (1 km)");
      return;
    }

    setLoading(true);

    try {
      // Get user location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 60000,
          maximumAge: 1000 * 60 * 15,
        });
      });

      const locationData = {
        radius: numRadius,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };

      const success = await onConfirm(locationData);
      if (success) {
        onClose();
      }
    } catch (err) {
      setLoading(false);
      if (err.code === 1) {
        setError(
          "Location permission denied. Please enable location access in your browser settings.",
        );
      } else if (err.code === 2) {
        setError("Location unavailable. Please try again.");
      } else if (err.code === 3) {
        setError("Location request timed out. Please try again.");
      } else {
        setError("Failed to get location. Please try again.");
      }
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const presetRadii = [10, 15, 20, 25, 30, 35, 40];

  if (!isOpen) return null;

  return (
    <div className="loc-popup-overlay" onClick={handleBackdropClick}>
      <div className="loc-popup">
        {/* Header */}
        <div className="loc-popup-header">
          <div className="loc-popup-icon">
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
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <h2>Enable Location</h2>
          <p>
            Set your restaurant's estimate radius to validate customer location
          </p>
        </div>

        {/* Body */}
        <div className="loc-popup-body">
          {/* Radius Input */}
          <div className="loc-input-wrap">
            <label htmlFor="radius">Service Radius (meters)</label>
            <div className="loc-input-field">
              <svg
                className="loc-input-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              <input
                type="number"
                id="radius"
                value={radius}
                onChange={handleRadiusChange}
                placeholder="Enter radius in meters"
                min="10"
                max="50000"
                disabled={loading}
              />
              <span className="loc-input-unit">m</span>
            </div>
            {error && (
              <div className="loc-input-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
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
                {error}
              </div>
            )}
          </div>

          {/* Quick Presets */}
          <div className="loc-presets">
            <span className="loc-presets-label">Quick Select:</span>
            <div className="loc-presets-chips">
              {presetRadii.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`loc-preset-chip ${parseInt(radius) === preset ? "loc-preset-active" : ""}`}
                  onClick={() => {
                    setRadius(preset);
                    setError("");
                  }}
                  disabled={loading}>
                  {preset >= 1000 ? `${preset / 1000} km` : `${preset} m`}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="loc-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <p>
              Customers outside this radius will not be able to place orders.
              Your current location will be used as the center point.{" "}
              <strong>
                Make sure you are at the restaurant when setting this location.
              </strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="loc-popup-footer">
          <button
            className="loc-btn-cancel"
            onClick={onClose}
            disabled={loading}>
            Cancel
          </button>
          <button
            className="loc-btn-confirm"
            onClick={handleConfirm}
            disabled={loading}>
            {loading ? (
              <>
                <svg
                  className="loc-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Getting Location...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Enable & Validate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationEnablePopup;
