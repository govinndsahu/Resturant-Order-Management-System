import z from "zod/v4";
import Version from "../models/versionModel.js";

export const updateAppVersion = async (req, res, next) => {
  const { appVersion } = req.body;

  try {
    const version = await Version.findOne();

    if (!version) {
      const newVersion = new Version({ version: 1 });
      await newVersion.save();
    } else {
      version.version = appVersion;
      await version.save();
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const getVersion = async (req, res, next) => {
  try {
    const version = await Version.findOne();
    return res.json({
      success: true,
      name: process.env.RESTAURANT_NAME,
      version,
    });
  } catch (error) {
    next(error);
  }
};
