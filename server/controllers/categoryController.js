import express from "express";
import z from "zod/v4";
import Category from "../models/categoryModel.js";

const router = express.Router();

export const createCategory = async (req, res, next) => {
  const { name, sn } = req.body;

  console.log(req.body);

  try {
    const category = await Category.findOne({ name });

    if (category) {
      return res.status(400).json({ error: "Category already exists" });
    }

    await Category.create({ name, sn });

    return res
      .status(201)
      .json({ success: true, message: "Category created successfully" });
  } catch (error) {
    next(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const updateCategory = async (req, res, next) => {
  const { name, sn } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(req.params.id, {
      name,
      sn,
    });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Category updated successfully" });
  } catch (error) {
    next(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    next(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ sn: 1 });
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export default router;
