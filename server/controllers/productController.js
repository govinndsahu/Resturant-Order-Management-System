import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

import { compressToTargetSize, increaseCount } from "../utils/utils.js";
import { addCache, preventCaching, purgeCache } from "../utils/cdnUtils.js";
import mongoose from "mongoose";
import { deleteFileFromR2, uploadFileToR2 } from "../utils/r2Utils.js";

// create a product
export const createProduct = async (req, res, next) => {
  const { name, category, price_type, full_price, sn } = req.body;
  try {
    const product = await Product.findOne({ name, category });

    if (product) {
      return res.status(400).json({
        error: "Product already exists",
      });
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

      await purgeCache({
        urls: ["/products"],
        origin: "menu.dgdine.in",
      });

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

    await purgeCache({
      urls: ["/products"],
      origin: "menu.dgdine.in",
    });

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

  const { isUpdating } = req.query;

  const { file } = req;

  try {
    const image = new mongoose.Types.ObjectId();

    const product = await Product.findById(id);

    let oldImageKey = null;

    if (isUpdating === "true") {
      oldImageKey = product.image.split("/").pop();
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const imageData = await compressToTargetSize(file.buffer, 49, "webp");

    const imageUrl = await uploadFileToR2({
      buffer: imageData,
      key: `${image}.jpg`,
      contentType: "image/jpg",
    });

    if (!imageUrl) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to upload product image" });
    }

    product.image = imageUrl;

    await product.save();

    if (isUpdating === "false") {
      await increaseCount(req);
    }

    if (isUpdating === "true") {
      await deleteFileFromR2({ key: oldImageKey });
    }

    await purgeCache({
      urls: ["/products"],
      origin: "menu.dgdine.in",
    });

    return res
      .status(200)
      .json({ success: true, message: "Product image uploaded successfully" });
  } catch (error) {
    if (isUpdating === "false") {
      await Product.findByIdAndDelete(id);
    }
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

    await purgeCache({
      urls: ["/products"],
      origin: "menu.dgdine.in",
    });

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
      await purgeCache({
        urls: ["/products"],
        origin: "menu.dgdine.in",
      });

      const imageKey = product.image.split("/").pop();
      await deleteFileFromR2({ key: imageKey });

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
    addCache({
      res,
      days: 360,
    });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    preventCaching(res);
    next(error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to get products" });
  }
};
