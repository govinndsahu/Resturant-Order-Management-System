import express from "express";
import {
  clearOrders,
  createOrder,
  deleteHistory,
  deleteOrder,
  doneAllOrders,
  getOrders,
  getOrdersAsHistory,
  markOrderAsDone,
} from "../controllers/orderController.js";
import { isLogedIn, isStaff } from "../middlewares/validateMiddleware.js";
import { validateRestaurantLocation } from "../middlewares/validateLocationMiddleware.js";
import {
  checkCount,
  increaseCount,
  resetCount,
} from "../middlewares/countMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  // validateRestaurantLocation,
  resetCount,
  checkCount,
  increaseCount,
  createOrder,
);

router.get("/", isLogedIn, isStaff, getOrders);

router.delete("/delete/:id", isLogedIn, isStaff, deleteOrder);

router.delete("/delete", isLogedIn, isStaff, clearOrders);

router.post("/mark-as-done/:id", isLogedIn, isStaff, markOrderAsDone);

router.post("/mark-all-as-done", isLogedIn, isStaff, doneAllOrders);

router.get("/history", isLogedIn, isStaff, getOrdersAsHistory);

router.delete("/delete", isLogedIn, isStaff, deleteHistory);

export default router;
