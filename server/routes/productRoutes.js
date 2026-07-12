import express from "express";
import multer from "multer";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  uploadProductImage,
} from "../controllers/productController.js";
import {
  isAdmin,
  isLogedIn,
  updateAppVersion,
} from "../middlewares/validateMiddleware.js";
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
  updateAppVersion,
  upload.single("image"),
  uploadProductImage,
);

router.put("/update/:id", isLogedIn, isAdmin, updateAppVersion, updateProduct);

router.delete(
  "/delete/:id",
  isLogedIn,
  isAdmin,
  updateAppVersion,
  decreaseItemCount,
  deleteProduct,
);

router.get("/", getProducts);

export default router;
