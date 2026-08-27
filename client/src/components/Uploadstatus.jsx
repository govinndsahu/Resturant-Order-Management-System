import { useEffect, useRef, useState } from "react";

const STEPS = {
  create: [
    "Uploading image",
    "Optimizing image",
    "Saving product",
    "Wrapping up",
  ],
  update: [
    "Uploading new image",
    "Optimizing image",
    "Updating product",
    "Wrapping up",
  ],
};

const STEP_INTERVAL_MS = 2500;

export default function SaveItemStatus({ show, mode = "create" }) {
  const steps = STEPS[mode] ?? STEPS.create;
  const [stepIndex, setStepIndex] = useState(0);
  const [mounted, setMounted] = useState(show);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (show) {
      setMounted(true);
      setStepIndex(0);
      intervalRef.current = setInterval(() => {
        setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
      }, STEP_INTERVAL_MS);
    } else {
      clearInterval(intervalRef.current);
      const t = setTimeout(() => setMounted(false), 260);
      return () => clearTimeout(t);
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, mode]);

  if (!mounted) return null;

  return (
    <div
      className={`sis-overlay ${show ? "sis-overlay--in" : "sis-overlay--out"}`}
      role="status"
      aria-live="polite">
      <div className="sis-card">
        <div className="sis-card__glow" aria-hidden="true" />

        <div className="sis-spinner" aria-hidden="true">
          <svg viewBox="0 0 60 60" className="sis-spinner__svg">
            <circle className="sis-spinner__track" cx="30" cy="30" r="24" />
            <circle className="sis-spinner__arc" cx="30" cy="30" r="24" />
          </svg>
          <svg viewBox="0 0 24 24" className="sis-spinner__icon">
            <path d="M4 16l4.5-6 3.5 4.5 2.5-3L20 16" />
            <circle cx="8.5" cy="8.5" r="1.6" />
            <rect x="3" y="4" width="18" height="16" rx="2.5" />
          </svg>
        </div>

        <h3 className="sis-title">{steps[stepIndex]}</h3>
        <p className="sis-subtitle">
          {mode === "update"
            ? "Updating your menu item"
            : "Adding your menu item"}{" "}
          — this only takes a moment
        </p>

        <div className="sis-steps">
          {steps.map((label, i) => (
            <div
              key={label}
              className={[
                "sis-step",
                i < stepIndex ? "sis-step--done" : "",
                i === stepIndex ? "sis-step--active" : "",
              ].join(" ")}>
              <span className="sis-step__marker">
                {i < stepIndex ? (
                  <svg viewBox="0 0 16 16" className="sis-step__check">
                    <path d="M3.5 8.5l3 3 6-6.5" />
                  </svg>
                ) : (
                  <span className="sis-step__dot" />
                )}
              </span>
              <span className="sis-step__label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
