import Configuration from "../models/configurationModel.js";
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

      await purgeCache({
        urls: ["/configuration/get"],
        origin: "menu.dgdine.in",
      });

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

    await purgeCache({
      urls: ["/configuration/get"],
      origin: "menu.dgdine.in",
    });

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

      await purgeCache({
        urls: ["/configuration/get"],
        origin: "menu.dgdine.in",
      });

      return res.status(200).json({
        success: true,
        message: "Location validation disabled successfully",
        config: existingConfig,
        user: null,
      });
    }

    await purgeCache({
      urls: ["/configuration/get"],
      origin: "menu.dgdine.in",
    });

    return res.status(200).json({
      success: true,
      config: { doValidate: false },
      user: null,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================== //

export const enablePhoneValidation = async (req, res, next) => {
  try {
    const config = await Configuration.findOne();

    config.customerPhoneValidation = {
      doValidate: true,
      user: null,
    };
    await config.save();

    await purgeCache({
      urls: ["/configuration/get"],
      origin: "menu.dgdine.in",
    });

    return res.status(201).json({
      success: true,
      message: "Phone validation enabled successfully",
      config,
      user: null,
    });
  } catch (error) {
    next(error);
  }
};

export const disablePhoneValidation = async (req, res, next) => {
  try {
    const config = await Configuration.findOne();

    config.customerPhoneValidation = {
      doValidate: false,
      user: null,
    };
    await config.save();

    await purgeCache({
      urls: ["/configuration/get"],
      origin: "menu.dgdine.in",
    });

    return res.status(200).json({
      success: true,
      message: "Phone validation disabled successfully",
      config,
      user: null,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================= //

export const getConfigurations = async (req, res, next) => {
  try {
    const config = await Configuration.findOne().select("-_id");

    addCache({ res, days: 360 });

    if (!config) {
      const newConfig = await Configuration.insertOne({});

      return res.status(200).json({
        success: true,
        config: newConfig,
      });
    }

    return res.status(200).json({
      success: true,
      config: config,
    });
  } catch (error) {
    preventCaching(res);
    next(error);
  }
};
