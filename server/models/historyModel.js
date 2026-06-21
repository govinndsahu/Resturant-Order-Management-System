import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
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
  },
  { timestamps: true },
);

const History = mongoose.model("History", historySchema);

export default History;
