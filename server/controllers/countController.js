import Count from "../models/countModel.js";

export const getCount = async (req, res, next) => {
  try {
    const count = await Count.findOne().select("-_id count maxCount");
    if (!count) {
      return res.status(404).json({ message: "Count not found" });
    }
    return res.json({ success: true, count });
  } catch (error) {
    next(error);
  }
};

export const updateCount = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(req.headers);
    return res.end();
  } catch (error) {
    next(error);
  }
};
