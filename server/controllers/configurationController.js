import Configuration from "../models/configurationModel.js";
import Session from "../models/sessionModel.js";

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

      return res.status(200).json({
        success: true,
        message: "Location validation disabled successfully",
        config: existingConfig,
        user: null,
      });
    }

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
    const sid = req.signedCookies?.sid;

    const config = await Configuration.findOne().select(
      "locationValidation.doValidate -_id",
    );

    let user = null;

    if (sid) {
      const session = await Session.findById({ _id: sid }).populate("userId");
      user = session.userId;
    }

    if (!config || !config.locationValidation) {
      return res.status(200).json({
        success: true,
        config: { doValidate: false },
        user: user
          ? { name: user.name, email: user.email, role: user.role }
          : null,
      });
    }

    return res.status(200).json({
      success: true,
      config: config.locationValidation,
      user: user
        ? { name: user.name, email: user.email, role: user.role }
        : null,
    });
  } catch (error) {
    next(error);
  }
};
