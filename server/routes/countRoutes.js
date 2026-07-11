import express from "express";
import { getCount, updateCount } from "../controllers/countController.js";
import { checkSignature, resetCount } from "../middlewares/countMiddleware.js";

const router = express.Router();

router.get("/", resetCount, getCount);

router.put("/update", checkSignature, updateCount);

export default router;
