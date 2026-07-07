import mongoose from "mongoose";

const countSchema = new mongoose.Schema(
  {
    count: { type: Number, default: 0 },
    maxCount: { type: Number, default: 20 },
  },
  { timestamps: true },
);

const Count = mongoose.model("Count", countSchema);

export default Count;
