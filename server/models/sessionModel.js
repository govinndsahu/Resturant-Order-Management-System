import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "365d",
  }, // Session expires after 365 days
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;