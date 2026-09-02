import { useState, useRef, useEffect } from "react";
import "../css/phoneOtp.css";
import { useConfig } from "../contexts/ConfigContext";
import { OTPWidget } from "@msg91comm/sendotp-sdk";
import { useLocalStorage } from "../hooks/useLocalStorage";

const PhoneOtpFlow = ({
  isOpen,
  onClose,
  onVerify,
  setIsOpen,
  setAccesstoken,
}) => {
  const { configurations } = useConfig();

  // Determine if OTP validation is required
  const shouldValidateOtp =
    configurations?.phoneOtpValidation?.doValidate ?? true;

  const [phone, setPhone] = useLocalStorage("phoneNumber", "");

  const [step, setStep] = useState("phone"); // "phone" | "otp" | "success"
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [reqId, setReqId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(15);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const { data } = configurations?.phoneOtpValidation;
    OTPWidget.initializeWidget(data?.widgetId, data?.tokenAuth);
  }, []);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep("phone");
      setOtp(["", "", "", ""]);
      setError("");
      setCountdown(15);
      setCanResend(false);
    }
  }, [isOpen]);

  // Countdown timer for resend
  useEffect(() => {
    if (step === "otp" && countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }

    return () => clearTimeout(timerRef.current);
  }, [step, countdown]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(value);
    setError("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    // If OTP validation is NOT required, skip directly to success
    if (!shouldValidateOtp) {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLoading(false);
      setStep("success");
      setTimeout(() => {
        onVerify(phone);
        onClose();
      }, 1000);
      return;
    }

    setLoading(true);
    // Simulate API call
    try {
      const otpResponse = await OTPWidget.sendOTP({
        identifier: "91" + phone,
      });
      if (otpResponse.type === "success") {
        setReqId(otpResponse.message);

        setLoading(false);
        setStep("otp");
        setCountdown(30);
        setCanResend(false);

        // Focus first OTP input
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        setLoading(false);
        setError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      setError("Please enter the complete 4-digit OTP");
      return;
    }
    setLoading(true);

    // Simulate API verification
    try {
      const verifyResponse = await OTPWidget.verifyOTP({
        reqId,
        otp: otp.join(""),
      });
      if (verifyResponse.type === "success") {
        setLoading(false);
        setStep("success");
        setAccesstoken(verifyResponse.message);
        setTimeout(() => {
          setIsOpen(false);
        }, 100);
      } else {
        setLoading(false);
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      setError("Failed to verify OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    setCanResend(false);
    setCountdown(30);
    setOtp(["", "", "", ""]);
    setError("");
    setLoading(true);

    try {
      const resendResponse = await OTPWidget.retryOTP({
        reqId,
        retryChannel: 11,
      });
      if (resendResponse.type === "success") {
        setReqId(resendResponse.message);
        setLoading(false);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setLoading(false);
      setError("Failed to resend OTP. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="po-overlay"
      onClick={(e) => e.target.className === "po-overlay" && onClose()}>
      <div className="po-card">
        {/* Close button */}
        <button className="po-close-btn" onClick={onClose} aria-label="Close">
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
        <div className="po-header">
          <div className="po-header-icon">
            {step === "phone" && (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            )}
            {step === "otp" && (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            )}
            {step === "success" && (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <div>
            <h2 className="po-title">
              {step === "phone" && "Verify Your Phone"}
              {step === "otp" && "Enter OTP"}
              {step === "success" && "Verified!"}
            </h2>
            <p className="po-subtitle">
              {step === "phone" && "One-time verification for secure ordering"}
              {step === "otp" && `Code sent to +91 ${phone}`}
              {step === "success" && "You're all set to place orders"}
            </p>
          </div>
        </div>

        {/* One-time info banner */}
        {step !== "success" && (
          <div className="po-info-banner">
            <div className="po-info-icon">
              <svg
                width="16"
                height="16"
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
            <p className="po-info-text">
              <strong>One-time process:</strong> We only verify your number
              once. No spam, no marketing calls — just secure order
              confirmation.
            </p>
          </div>
        )}

        {/* Phone Step */}
        {step === "phone" && (
          <form className="po-form" onSubmit={handleSendOtp}>
            <div className="po-field">
              <label className="po-label">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Phone Number
              </label>
              <div className="po-input-wrapper">
                <span className="po-country-code">+91</span>
                <input
                  type="tel"
                  className="po-input"
                  placeholder="9876543210"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  autoFocus
                />
              </div>
              {error && <span className="po-error">{error}</span>}
            </div>

            <button
              type="submit"
              className="po-btn-primary"
              disabled={loading || phone.length !== 10}>
              {loading ? (
                <span className="po-btn-spinner">
                  <span className="po-spinner-ring"></span>
                  {shouldValidateOtp ? "Sending..." : "Verifying..."}
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
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  {shouldValidateOtp ? "Send OTP" : "Continue"}
                </>
              )}
            </button>
          </form>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <form className="po-form" onSubmit={handleVerifyOtp}>
            <div className="po-field">
              <label className="po-label">
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
                4-Digit Code
              </label>
              <div className="po-otp-grid">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    className={`po-otp-input ${digit ? "po-otp-filled" : ""}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    maxLength={1}
                  />
                ))}
              </div>
              {error && <span className="po-error">{error}</span>}
            </div>

            <button
              type="submit"
              className="po-btn-primary"
              disabled={loading || otp.join("").length !== 4}>
              {loading ? (
                <span className="po-btn-spinner">
                  <span className="po-spinner-ring"></span>
                  Verifying...
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
                  Verify & Continue
                </>
              )}
            </button>

            <div className="po-resend">
              {canResend ? (
                <button
                  type="button"
                  className="po-resend-btn"
                  onClick={handleResendOtp}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  Resend OTP
                </button>
              ) : (
                <span className="po-resend-timer">
                  Resend in <strong>{countdown}s</strong>
                </span>
              )}
            </div>

            <button
              type="button"
              className="po-change-phone"
              onClick={() => setStep("phone")}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Change phone number
            </button>
          </form>
        )}

        {/* Success Step */}
        {step === "success" && (
          <div className="po-success">
            <div className="po-success-ring">
              <div className="po-success-icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <p className="po-success-text">Phone verified successfully!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneOtpFlow;
