import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sn: {
    type: Number,
    default: 1,
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
