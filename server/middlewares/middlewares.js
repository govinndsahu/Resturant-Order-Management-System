import Order from "../models/orderModel.js";

export const clearArchives = async (req, res, next) => {
  try {
    const firstOrder = await Order.findOne({ isArchived: false }).sort({
      createdAt: 1,
    });

    if (!firstOrder) return next();

    const firstOrderDate = new Date(firstOrder.createdAt);
    firstOrderDate.setHours(6, 0, 0, 0);

    const willBeArchivedMs = firstOrderDate.getTime() + 1 * 24 * 60 * 60 * 1000;

    if (Date.now() > willBeArchivedMs) {
      await Order.deleteMany({ isArchived: true });
      await Order.updateMany(
        { isArchived: false, orderedAt: { $lt: willBeArchivedMs } },
        { isArchived: true },
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
