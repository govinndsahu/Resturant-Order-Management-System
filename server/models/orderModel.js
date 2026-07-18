import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: {
      type: Array,
      required: true,
    },
    tableNumber: {
      type: Number,
      required: true,
    },
    buyer: {
      type: String,
      default: "",
    },
    total: {
      type: Number,
      required: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
