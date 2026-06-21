import express from "express";
import {
  clearHistory,
  createHistory,
  deleteHistory,
  getHistory,
} from "../controllers/historyController.js";
import { isLogedIn, isStaff } from "../middlewares/validateMiddleware.js";

const router = express.Router();

router.post("/create", isLogedIn, isStaff, createHistory);

router.delete("/delete/:id", isLogedIn, isStaff, deleteHistory);

router.delete("/delete", isLogedIn, isStaff, clearHistory);

router.get("/", isLogedIn, isStaff, getHistory);

export default router;
