import { rateLimit } from "express-rate-limit";

export const orderLimiter = rateLimit({
  windowMs: 1000 * 60 * 10,
  limit: 1,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
