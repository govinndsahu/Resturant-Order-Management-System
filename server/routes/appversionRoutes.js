import express from "express";
import { updateAppVersion } from "../controllers/appversionController.js";
import { isAdmin, isLogedIn } from "../middlewares/validateMiddleware.js";

const router = express.Router();

router.put("/update", isLogedIn, isAdmin, updateAppVersion);

export default router;
