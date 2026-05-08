import mongoose from "mongoose";
import { mime } from "zod";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price_type: {
    type: String,
    required: true,
  },
  full_price: {
    type: Number,
  },
  half_price: {
    type: Number,
    default: null,
  },
  image: {
    type: String,
  },
  mimeType: {
    type: String,
    default: "image/jpg",
  },
  sn: {
    type: Number,
    default: 1,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
