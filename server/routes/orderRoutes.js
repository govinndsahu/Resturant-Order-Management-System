import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrders,
} from "../controllers/orderController.js";
import {
  isLogedIn,
  isNewAppVersion,
  isStaff,
} from "../middlewares/validateMiddleware.js";
import { validateRestaurantLocation } from "../middlewares/validateLocationMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  validateRestaurantLocation,
  isNewAppVersion,
  createOrder,
);

router.get("/", isLogedIn, isStaff, getOrders);

router.delete("/delete/:id", isLogedIn, isStaff, deleteOrder);

export default router;
