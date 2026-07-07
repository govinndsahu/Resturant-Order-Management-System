import express from "express";
import {
  clearOrders,
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
import { checkCount, increaseCount } from "../middlewares/countMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  // validateRestaurantLocation,
  isNewAppVersion,
  checkCount,
  increaseCount,
  createOrder,
);

router.get("/", isLogedIn, isStaff, getOrders);

router.delete("/delete/:id", isLogedIn, isStaff, deleteOrder);

router.delete("/delete", isLogedIn, isStaff, clearOrders);

export default router;
