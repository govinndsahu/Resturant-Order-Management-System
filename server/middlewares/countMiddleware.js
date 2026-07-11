import Count from "../models/countModel.js";
import crypto from "crypto";

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

export const checkSignature = (req, res, next) => {
  try {
    const dgDineSignature = req.headers["dgdine-signature"];

    if (!dgDineSignature) {
      console.log("Signature not found.");
      return res.end();
    }

    const signature = crypto
      .createHmac("sha256", process.env.MENU_SECRET)
      .update(JSON.stringify(req.body.payload))
      .digest("hex");

    console.log({ signature, dgDineSignature });

    if (signature !== dgDineSignature) {
      console.log("Signature is invalid.");
      return res.end();
    }

    next();
  } catch (error) {
    next(error);
  }
};
