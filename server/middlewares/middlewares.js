import Order from "../models/orderModel.js";

export const clearArchives = async (req, res, next) => {
  try {
    const firstOrder = await Order.findOne({ isArchived: false }).sort({
      createdAt: 1,
    });

    if (!firstOrder) return next();

    const willBeArchived =
      new Date(firstOrder.createdAt).getTime() + 1000 * 60 * 60 * 24 * 1;

    if (Date.now() > willBeArchived) {
      await Order.deleteMany({ isArchived: true });
      await Order.updateMany({ isArchived: false }, { isArchived: true });
    }

    next();
  } catch (error) {
    next(error);
  }
};
