import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

import fs from "fs";

// create a product
export const createProduct = async (req, res, next) => {
  const { name, category, price_type, full_price, sn } = req.body;
  try {
    const product = await Product.findOne({ name, category });

    if (product) {
      return res.status(400).json({ error: "Product already exists" });
    }

    if (price_type === "both") {
      const half_price = req.body.half_price;

      const newProduct = new Product({
        name,
        category,
        price_type,
        full_price,
        half_price,
        sn,
      });

      await newProduct.save();

      return res.status(201).json({
        success: true,
        id: newProduct._id,
        message: "Product created successfully",
      });
    }

    const newProduct = new Product({
      name,
      category,
      price_type,
      full_price,
      sn,
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      id: newProduct._id,
      message: "Product created successfully",
    });
  } catch (error) {
    next(error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create product" });
  }
};

export const uploadProductImage = async (req, res, next) => {
  const { id } = req.params;

  const { file } = req;

  const imageData = file.buffer.toString("base64");

  if (file.size > 500 * 1024) {
    await Product.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ error: "File size exceeds the limit of 500KB" });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.image = imageData;
    product.mimeType = file.mimetype;

    await product.save();

    return res
      .status(200)
      .json({ success: true, message: "Product image uploaded successfully" });
  } catch (error) {
    next(error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to upload product image" });
  }
};

export const updateProduct = async (req, res, next) => {
  const { name, category, price_type, full_price, sn } = req.body;
  try {
    const product = await Product.findById(req.params.id);

    const categori = await Category.findById(category);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!categori) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Update the product fields
    product.name = name;
    product.category = category;
    product.price_type = price_type;
    product.full_price = full_price;
    product.sn = sn;
    product.half_price = null;

    if (price_type === "both") {
      product.half_price = req.body.half_price;
    }

    await product.save();

    return res
      .status(200)
      .json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    next(error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update product" });
  }
};

export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    } else {
      await product.deleteOne();
      return res
        .status(200)
        .json({ success: true, message: "Product deleted successfully" });
    }
  } catch (error) {
    next(error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete product" });
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ sn: 1 });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to get products" });
  }
};
