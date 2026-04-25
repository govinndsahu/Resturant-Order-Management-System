import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sn: {
    type: Number,
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
