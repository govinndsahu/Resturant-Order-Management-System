import express from "express";

const router = express.Router();

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import { isAdmin, isLogedIn } from "../middlewares/validateMiddleware.js";

router.post("/create", isLogedIn, isAdmin, createCategory);

router.put("/update/:id", isLogedIn, isAdmin, updateCategory);

router.delete("/delete/:id", isLogedIn, isAdmin, deleteCategory);

router.get("/", getCategories);

export default router;
