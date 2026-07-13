import Count from "../models/countModel.js";
import { handleCancelEvent, handleChargeEvent } from "../utils/utils.js";

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
    const { event } = req.body;

    const count = await Count.findOne();
    if (!count) {
      return res.status(404).json({ message: "Count not found" });
    }

    switch (event) {
      case "subscription.charged":
        await handleChargeEvent({ req, count });
        break;
      case "subscription.cancelled":
        await handleCancelEvent({ count });
        break;
      case "subscription.paused":
        break;
      case "subscription.resumed":
        break;
      default:
        console.warn(`Unhandled event: ${event}`);
    }

    return res
      .status(200)
      .json({ success: true, message: "Count updated successfully" });
  } catch (error) {
    next(error);
  }
};
