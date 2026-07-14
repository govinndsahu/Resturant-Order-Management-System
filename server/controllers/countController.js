import Count from "../models/countModel.js";
import {
  handleCancelEvent,
  handleChargeEvent,
  handlePauseEvent,
  handleResumeEvent,
} from "../utils/utils.js";

export const getCount = async (req, res, next) => {
  try {
    return res.json({
      success: true,
      count: {
        count: req.count.count,
        maxCount: req.count.maxCount,
        resetDate: req.count.resetDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCount = async (req, res, next) => {
  try {
    const { event, payload } = req.body;

    const count = req.count;

    if (!count) {
      return res.status(404).json({ message: "Count not found" });
    }

    if (event === "subscription.charged") {
      await handleChargeEvent({ req, count });
    } else if (event === "subscription.cancelled") {
      await handleCancelEvent({ count, payload });
    } else if (event === "subscription.paused") {
      await handlePauseEvent({ count, payload });
    } else if (event === "subscription.resumed") {
      await handleResumeEvent({ payload, count });
    } else {
      console.warn(`Unhandled event: ${event}`);
    }

    if (event === "subscription.paused") {
      return res.status(200).json({ success: true, count: req.oldCount });
    }

    return res
      .status(200)
      .json({ success: true, message: "Count updated successfully" });
  } catch (error) {
    next(error);
  }
};
