import mongoose from "mongoose";

const configurationSchema = new mongoose.Schema(
  {
    locationValidation: {
      type: Object,
      default: {
        doValidate: false,
        data: null,
      },
    },
    customerPhoneValidation: {
      type: Object,
      default: {
        doValidate: false,
        data: null,
      },
    },
    phoneOtpValidation: {
      type: Object,
      default: {
        doValidate: false,
        data: null,
      },
    },
  },
  {
    versionKey: false,
  },
);

const Configuration = mongoose.model("Configuration", configurationSchema);

export default Configuration;
