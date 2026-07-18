import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
    expires: "365d",
  },
  expiresAt: {
    type: Number,
    default: null,
  },
  tableNumber: {
    type: Number,
    default: null,
  },
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
