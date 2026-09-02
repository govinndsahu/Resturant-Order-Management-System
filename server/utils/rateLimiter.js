import { ipKeyGenerator, rateLimit } from "express-rate-limit";

export const orderLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.sessionId || ipKeyGenerator(req.ip), // session first, IP fallback
  message: "Too many requests, please slow down and try again shortly.",
});
