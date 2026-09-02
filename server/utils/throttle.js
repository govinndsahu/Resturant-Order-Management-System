import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
export const purify = DOMPurify(window);

export const throttle = (waitTime = 1000) => {
  const throttleData = {};

  // Periodically clean up stale entries so this object doesn't grow forever
  const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
  const STALE_AFTER = 2 * 60 * 1000; // 2 minutes of inactivity
  setInterval(() => {
    const now = Date.now();
    for (const key in throttleData) {
      if (now - throttleData[key].lastRequestTime > STALE_AFTER) {
        delete throttleData[key];
      }
    }
  }, CLEANUP_INTERVAL);

  return (req, res, next) => {
    const now = Date.now();

    // Prefer session/table identifier; fall back to IP if not available
    const key = req.sessionId || req.headers["x-session-token"] || req.ip;

    const { previousDelay, lastRequestTime } = throttleData[key] || {
      previousDelay: 0,
      lastRequestTime: now - waitTime * 1000,
    };

    const timePassed = now - lastRequestTime;
    const delay = Math.max(0, waitTime * 1000 + previousDelay - timePassed);

    throttleData[key] = {
      previousDelay: delay,
      lastRequestTime: now,
    };

    setTimeout(next, delay);
  };
};
