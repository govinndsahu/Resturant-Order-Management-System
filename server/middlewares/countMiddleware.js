import Count from "../models/countModel.js";

export const checkCount = async (req, res, next) => {
  try {
    let count = await Count.findOne();
    if (!count) {
      const newCount = await Count.create({ count: 0 });
      count = newCount;
    }
    if (count.count >= count.maxCount) {
      return res
        .status(400)
        .json({ error: "Count has reached the maximum limit" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const increaseCount = async (req, res, next) => {
  try {
    const count = await Count.findOne();
    if (!count) {
      return res.status(404).json({ message: "Count not found" });
    }
    count.count += 1;
    await count.save();
    next();
  } catch (error) {
    next(error);
  }
};
