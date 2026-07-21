import express from "express";
import {
  disableLocationValidation,
  enableLocationValidation,
  getLocationValidationConfig,
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

router.get("/get/location/validation/config", getLocationValidationConfig);

export default router;
