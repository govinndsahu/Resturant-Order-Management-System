import express from "express";
import {
  getVersion,
  updateAppVersion,
} from "../controllers/appversionController.js";
import Version from "../models/versionModel.js";

const router = express.Router();

router.get("/", getVersion);

export default router;
