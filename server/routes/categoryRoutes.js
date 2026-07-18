import express from "express";

const router = express.Router();

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import { isAdmin, isLogedIn } from "../middlewares/validateMiddleware.js";
import { updateVersion } from "../middlewares/updateMiddleware.js";

router.post("/create", isLogedIn, isAdmin, updateVersion, createCategory);

router.put("/update/:id", isLogedIn, isAdmin, updateVersion, updateCategory);

router.delete("/delete/:id", isLogedIn, isAdmin, updateVersion, deleteCategory);

router.get("/", getCategories);

export default router;
