import Configuration from "../models/configurationModel.js";

export const enableLocationValidation = async (req, res, next) => {
  try {
    const { latitude, longitude, radius } = req.body;

    const existingConfig = await Configuration.findOne();

    if (existingConfig) {
      existingConfig.locationValidation = {
        doValidate: true,
        data: { latitude, longitude, radius },
      };

      await existingConfig.save();

      return res.status(200).json({
        success: true,
        message: "Location validation enabled successfully",
        config: existingConfig,
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
      });
    }

    return res.status(404).json({
      success: false,
      message: "Location validation configuration not found",
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

    if (!config || !config.locationValidation) {
      return res.status(404).json({
        success: false,
        message: "Location validation configuration not found",
      });
    }
    return res.status(200).json({
      success: true,
      config: config.locationValidation,
    });
  } catch (error) {
    next(error);
  }
};
