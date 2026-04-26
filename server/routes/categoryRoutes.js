import express from "express";

const router = express.Router();

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import {
  isAdmin,
  isLogedIn,
  updateAppVersion,
} from "../middlewares/validateMiddleware.js";

router.post("/create", isLogedIn, isAdmin, updateAppVersion, createCategory);

router.put("/update/:id", isLogedIn, isAdmin, updateAppVersion, updateCategory);

router.delete(
  "/delete/:id",
  isLogedIn,
  isAdmin,
  updateAppVersion,
  deleteCategory,
);

router.get("/", getCategories);

export default router;
