import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrders,
} from "../controllers/orderController.js";
import { isLogedIn, isStaff } from "../middlewares/validateMiddleware.js";

const router = express.Router();

router.post("/create", createOrder);

router.get("/", isLogedIn, isStaff, getOrders);

router.delete("/delete/:id", isLogedIn, isStaff, deleteOrder);

export default router;
