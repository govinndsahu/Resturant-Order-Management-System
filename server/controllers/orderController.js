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
