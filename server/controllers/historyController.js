import express from "express";
import { createOrderSchema } from "../validator/orderSchema.js";
import History from "../models/historyModel.js";

const router = express.Router();

export const createHistory = async (req, res, next) => {
  try {
    const { products, tableNumber, buyer, total } = req.body.order;

    const history = new History({ products, tableNumber, buyer, total });

    await history.save();

    return res.status(201).json({
      success: true,
      message: "History  created successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const histories = await History.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      histories,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await History.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "History deleted successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
