import Count from "../models/countModel.js";

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
    const count = await Count.findOne();

    if (!count) {
      return res.status(404).json({ message: "Count not found" });
    }

    if (req.plan.id === process.env.RAZORPAY_PLAN_STARTER) {
      count.count = 0;
      count.maxCount = 1000;
      await count.save();
    } else if (req.plan.id === process.env.RAZORPAY_PLAN_GROWTH) {
      count.count = 0;
      count.maxCount = 5000;
      await count.save();
    } else if (req.plan.id === process.env.RAZORPAY_PLAN_PRO) {
      count.count = 0;
      count.maxCount = 250000;
      await count.save();
    } else if (req.plan.id === process.env.RAZORPAY_PLAN_ENTERPRISE) {
      count.count = 0;
      count.maxCount = 500000;
      await count.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "Count updated successfully" });
  } catch (error) {
    next(error);
  }
};
