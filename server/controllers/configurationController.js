import Configuration from "../models/configurationModel.js";
import Session from "../models/sessionModel.js";
import { addCache, preventCaching, purgeCache } from "../utils/cdnUtils.js";

export const enableLocationValidation = async (req, res, next) => {
  try {
    const { latitude, longitude, radius } = req.body;

    const existingConfig = await Configuration.findOne();

    if (existingConfig) {
      existingConfig.locationValidation = {
        doValidate: true,
        data: { latitude, longitude, radius },
        user: null,
      };

      await existingConfig.save();

      purgeCache({ urls: ["/get/location/validation/config"] });

      return res.status(200).json({
        success: true,
        message: "Location validation enabled successfully",
        config: existingConfig,
        user: null,
      });
    }

    const config = await Configuration.insertOne({
      locationValidation: {
        doValidate: true,
        data: { latitude, longitude, radius },
      },
    });

    purgeCache({ urls: ["/get/location/validation/config"] });

    return res.status(201).json({
      success: true,
      message: "Location validation enabled successfully",
      config,
      user: null,
    });
  } catch (error) {
    next(error);
  }
};

export const disableLocationValidation = async (req, res, next) => {
  try {
    const existingConfig = await Configuration.findOne();

    if (existingConfig) {
      existingConfig.locationValidation = {
        doValidate: false,
        data: null,
      };

      await existingConfig.save();

      purgeCache({ urls: ["/get/location/validation/config"] });

      return res.status(200).json({
        success: true,
        message: "Location validation disabled successfully",
        config: existingConfig,
        user: null,
      });
    }

    purgeCache({ urls: ["/get/location/validation/config"] });

    return res.status(200).json({
      success: true,
      config: { doValidate: false },
      user: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getLocationValidationConfig = async (req, res, next) => {
  try {
    const config = await Configuration.findOne().select(
      "locationValidation.doValidate -_id",
    );

    addCache({ res, days: 360 });

    if (!config || !config.locationValidation) {
      return res.status(200).json({
        success: true,
        config: { doValidate: false },
      });
    }

    return res.status(200).json({
      success: true,
      config: config.locationValidation,
    });
  } catch (error) {
    preventCaching(res);
    next(error);
  }
};
