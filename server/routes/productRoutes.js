import express from "express";
import multer from "multer";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  uploadProductImage,
} from "../controllers/productController.js";
import { isAdmin, isLogedIn } from "../middlewares/validateMiddleware.js";
import {
  checkItemCount,
  decreaseItemCount,
  increaseItemCount,
} from "../middlewares/countMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/create",
  isLogedIn,
  isAdmin,
  checkItemCount,
  increaseItemCount,
  createProduct,
);

router.post(
  "/upload-image/:id",
  isLogedIn,
  isAdmin,
  upload.single("image"),
  uploadProductImage,
);

router.put("/update/:id", isLogedIn, isAdmin, updateProduct);

router.delete(
  "/delete/:id",
  isLogedIn,
  isAdmin,
  decreaseItemCount,
  deleteProduct,
);

router.get("/", getProducts);

export default router;
