import mongoose from "mongoose";
import { de } from "zod/v4/locales";

const versionSchema = new mongoose.Schema(
  {
    version: {
      type: Number,
      default: 1,
    },
  },
  { versionKey: false },
);

const Version = mongoose.model("Version", versionSchema);

export default Version;
