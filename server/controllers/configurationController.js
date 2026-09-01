import Configuration from "../models/configurationModel.js";
import { addCache, preventCaching, purgeCache } from "../utils/cdnUtils.js";
import z from "zod/v4";

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
      data: null,
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
      data: null,
    };

    if (config.phoneOtpValidation.doValidate) {
      config.phoneOtpValidation = {
        ...config.phoneOtpValidation,
        doValidate: false,
      };
    }

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

export const enableOtpValidation = async (req, res, next) => {
  try {
    const { data, success, error } = z
      .object({
        widgetId: z.string().min(1, "Widget ID is required"),
        tokenAuth: z.string().min(1, "Token Auth is required"),
        authKey: z.string().min(1, "Auth Key is required"),
      })
      .safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
        error,
      });
    }

    const { widgetId, tokenAuth, authKey } = data;

    const config = await Configuration.findOne();

    config.phoneOtpValidation = {
      doValidate: true,
      data: {
        widgetId,
        tokenAuth,
        authKey,
      },
    };
    config.customerPhoneValidation = {
      doValidate: true,
      data: null,
    };
    await config.save();

    await purgeCache({
      urls: ["/configuration/get"],
      origin: "menu.dgdine.in",
    });

    return res.status(201).json({
      success: true,
      message: "OTP validation enabled successfully",
      config,
      user: null,
    });
  } catch (error) {
    next(error);
  }
};

export const disableOtpValidation = async (req, res, next) => {
  try {
    const config = await Configuration.findOne();

    config.customerPhoneValidation = {
      doValidate: false,
      data: null,
    };
    config.phoneOtpValidation = {
      ...config.phoneOtpValidation,
      doValidate: false,
    };

    await config.save();

    await purgeCache({
      urls: ["/configuration/get"],
      origin: "menu.dgdine.in",
    });

    return res.status(200).json({
      success: true,
      message: "OTP validation disabled successfully",
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
    const config = await Configuration.findOne().select(
      "-_id -phoneOtpValidation.data.authKey",
    );

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
