import express from "express";
import { getCount } from "../controllers/countController.js";

const router = express.Router();

router.get("/", getCount);

export default router;
