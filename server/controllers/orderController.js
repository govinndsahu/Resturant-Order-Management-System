import Order from "../models/orderModel.js";
import { createOrderSchema } from "../validator/orderSchema.js";

export const createOrder = async (req, res, next) => {
  try {
    const { data, success, error } = createOrderSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({ error: error.errors });
    }

    const { products, tableNumber, buyer, total } = data;

    const order = new Order({ products, tableNumber, buyer, total });

    await order.save();

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const clearOrders = async (req, res, next) => {
  try {
    const rawIds = req.body?.ids;

    const ids = Array.isArray(rawIds)
      ? rawIds
      : typeof rawIds === "string"
        ? JSON.parse(rawIds)
        : [];

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ids must be a non-empty array",
      });
    }

    await Order.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      success: true,
      message: "Orders cleared successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
