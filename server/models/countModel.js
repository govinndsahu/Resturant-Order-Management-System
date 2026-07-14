import mongoose from "mongoose";

const countSchema = new mongoose.Schema(
  {
    count: { type: Number, default: 0 },
    maxCount: { type: Number, default: 100 },
    itemCount: { type: Number, default: 0 },
    maxItemCount: { type: Number, default: 10 },
    willReset: { type: Boolean, default: false },
    resetDate: { type: Number, default: Date.now() + 30 * 24 * 60 * 60 * 1000 },
  },
  { timestamps: true },
);

const Count = mongoose.model("Count", countSchema);

export default Count;
