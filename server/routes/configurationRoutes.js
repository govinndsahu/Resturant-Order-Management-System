import express from "express";
import {
  disableLocationValidation,
  enableLocationValidation,
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

router.get("/get", getConfigurations);

export default router;
