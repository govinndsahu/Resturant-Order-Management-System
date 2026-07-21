import mongoose from "mongoose";

const configurationSchema = new mongoose.Schema(
  {
    locationValidation: {
      type: Object,
      default: null,
    },
  },
  {
    versionKey: false,
  },
);

const Configuration = mongoose.model("Configuration", configurationSchema);

export default Configuration;
