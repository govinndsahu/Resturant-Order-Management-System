import express from "express";
import {
  clearOrders,
  createOrder,
  deleteHistory,
  deleteOrder,
  doneAllOrders,
  getArchivedOrders,
  getOrders,
  getOrdersAsHistory,
  markOrderAsDone,
} from "../controllers/orderController.js";
import { isLogedIn, isStaff } from "../middlewares/validateMiddleware.js";
import {
  validateOtp,
  validatePhoneNumber,
  validateRestaurantLocation,
} from "../middlewares/validateConfigMiddleware.js";
import {
  checkCount,
  increaseCount,
  resetCount,
} from "../middlewares/countMiddleware.js";
import { setSession } from "../middlewares/sessionMiddleware.js";
import { orderLimiter } from "../utils/rateLimiter.js";
import { throttle } from "../utils/throttle.js";
import { clearArchives } from "../middlewares/middlewares.js";

const router = express.Router();

router.post(
  "/create",
  setSession,
  orderLimiter,
  throttle(30),
  validateRestaurantLocation,
  validatePhoneNumber,
  validateOtp,
  resetCount,
  checkCount,
  increaseCount,
  clearArchives,
  createOrder,
);

router.get("/", isLogedIn, isStaff, getOrders);

router.delete("/delete/:id", isLogedIn, isStaff, deleteOrder);

router.delete("/delete", isLogedIn, isStaff, clearOrders);

router.post("/mark-as-done/:id", isLogedIn, isStaff, markOrderAsDone);

router.post("/mark-all-as-done", isLogedIn, isStaff, doneAllOrders);

router.get("/history", isLogedIn, isStaff, getOrdersAsHistory);

router.delete("/history/delete/:id", isLogedIn, isStaff, deleteHistory);

router.get("/get/archives", isLogedIn, isStaff, getArchivedOrders);

export default router;
