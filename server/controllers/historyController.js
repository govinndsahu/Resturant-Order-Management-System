import History from "../models/historyModel.js";

export const createHistory = async (req, res, next) => {
  try {
    const { products, tableNumber, buyer, total } = req.body.order;

    const history = new History({ products, tableNumber, buyer, total });

    await history.save();

    return res.status(201).json({
      success: true,
      message: "History  created successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const histories = await History.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      histories,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await History.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "History deleted successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const clearHistory = async (req, res, next) => {
  try {
    const rawIds = req.body?.ids;

    const ids = Array.isArray(rawIds)
      ? rawIds
      : typeof rawIds === "string"
        ? JSON.parse(rawIds)
        : [];

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ids must be a non-empty array",
      });
    }

    await History.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({
      success: true,
      message: "History cleared successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
