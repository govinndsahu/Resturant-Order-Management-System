import express from "express";
import { getVersion } from "../controllers/appversionController.js";

const router = express.Router();

router.get("/", getVersion);

export default router;
