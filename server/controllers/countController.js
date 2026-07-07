import Count from "../models/countModel.js";

export const getCount = async (req, res, next) => {
  try {
    const count = await Count.findOne().select("-_id");
    if (!count) {
      return res.status(404).json({ message: "Count not found" });
    }
    return res.json({ success: true, count });
  } catch (error) {
    next(error);
  }
};
