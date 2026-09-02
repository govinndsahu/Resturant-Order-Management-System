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
import { validatePhoneNumber, validateRestaurantLocation } from "../middlewares/validateConfigMiddleware.js";
import {
  checkCount,
  increaseCount,
  resetCount,
} from "../middlewares/countMiddleware.js";
import { setSession } from "../middlewares/sessionMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  setSession,
  validateRestaurantLocation,
  validatePhoneNumber,
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

router.delete("/history/delete/:id", isLogedIn, isStaff, deleteHistory);

export default router;
