import Count from "../models/countModel.js";
import crypto from "crypto";

export const checkCount = async (req, res, next) => {
  try {
    const count = req.count;
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

export const checkItemCount = async (req, res, next) => {
  try {
    const count = await Count.findOne();
    if (!count) {
      return res.status(404).json({ message: "Count not found" });
    }
    if (count.itemCount >= count.maxItemCount)
      return res
        .status(400)
        .json({ error: "Iteam count has reached the maximum limit" });

    req.count = count;
    next();
  } catch (error) {
    next(error);
  }
};

export const increaseCount = async (req, res, next) => {
  try {
    const count = req.count;
    count.count += 1;
    await count.save();
    next();
  } catch (error) {
    next(error);
  }
};

export const increaseItemCount = async (req, res, next) => {
  try {
    const count = req.count;
    count.itemCount += 1;
    await count.save();
    next();
  } catch (error) {
    next(error);
  }
};

export const decreaseItemCount = async (req, res, next) => {
  try {
    const count = await Count.findOne();
    count.itemCount -= 1;
    await count.save();
    next();
  } catch (error) {
    next(error);
  }
};

export const checkSignature = async (req, res, next) => {
  try {
    const count = await Count.findOne();

    const oldCount = count;

    const dgDineSignature = req.headers["dgdine-signature"];

    if (!dgDineSignature) {
      console.log("Signature not found.");
      return res.end();
    }

    const signature = crypto
      .createHmac("sha256", process.env.MENU_SECRET)
      .update(JSON.stringify(req.body.payload))
      .digest("hex");

    if (signature !== dgDineSignature) {
      console.log("Signature is invalid.");
      return res.end();
    }

    req.planId =
      req.body?.payload.subscription?.entity.plan_id ||
      req.body?.payload.razorpayPlanId;

    req.count = count;

    req.oldCount = {
      count: count.count,
      maxCount: count.maxCount,
      maxItemCount: count.maxItemCount,
      willReset: count.willReset,
      resetDate: count.resetDate,
    };

    

    next();
  } catch (error) {
    next(error);
  }
};

export const resetCount = async (req, res, next) => {
  try {
    let count = await Count.findOne();

    if (!count) {
      const newCount = await Count.insertOne({ count: 0 });
      count = newCount;
    }

    if (!count.willReset) {
      req.count = count;
      return next();
    }

    const currentDate = Date.now();

    if (currentDate >= count.resetDate) {
      count.count = 0;
      count.maxCount = 100;
      count.maxItemCount = 10;
      count.resetDate = currentDate + 30 * 24 * 60 * 60 * 1000;
      await count.save();
    }

    req.count = count;
    next();
  } catch (error) {
    next(error);
  }
};
