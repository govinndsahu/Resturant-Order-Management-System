import express from "express";
import {
  disableLocationValidation,
  disableOtpValidation,
  disablePhoneValidation,
  enableLocationValidation,
  enableOtpValidation,
  enablePhoneValidation,
  getConfigurations,
} from "../controllers/configurationController.js";
import { isAdmin, isLogedIn } from "../middlewares/validateMiddleware.js";

const router = express.Router();

router.post(
  "/enable/location/validation",
  isLogedIn,
  isAdmin,
  enableLocationValidation,
);

router.post(
  "/disable/location/validation",
  isLogedIn,
  isAdmin,
  disableLocationValidation,
);

router.post(
  "/enable/phone/validation",
  isLogedIn,
  isAdmin,
  enablePhoneValidation,
);

router.post(
  "/disable/phone/validation",
  isLogedIn,
  isAdmin,
  disablePhoneValidation,
);

router.post("/enable/otp/validation", isLogedIn, isAdmin, enableOtpValidation);

router.post(
  "/disable/otp/validation",
  isLogedIn,
  isAdmin,
  disableOtpValidation,
);

router.get("/get", getConfigurations);

export default router;
