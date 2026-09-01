import express from "express";
import {
  disableLocationValidation,
  enableLocationValidation,
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

router.get("/get", getConfigurations);

export default router;
