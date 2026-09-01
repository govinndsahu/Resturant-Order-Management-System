import Configuration from "../models/configurationModel.js";
import { getDistanceInMeters } from "../utils/utils.js";

export const validateRestaurantLocation = async (req, res, next) => {
  const { lat, lng } = req.body;

  const config = await Configuration.findOne();

  if (
    !config ||
    !config.locationValidation ||
    !config.locationValidation.doValidate
  ) {
    return next();
  }

  // GPS coordinates must be provided
  if (!lat || !lng) {
    return res.status(403).json({
      success: false,
      code: "LOCATION_MISSING",
      message: "Location access is required to use this service.",
    });
  }

  const distance = getDistanceInMeters(
    config.locationValidation.data.latitude,
    config.locationValidation.data.longitude,
    parseFloat(lat),
    parseFloat(lng),
  );

  if (distance > config.locationValidation.data.radius) {
    return res.status(403).json({
      success: false,
      code: "OUTSIDE_RESTAURANT",
      message: `You must be inside the restaurant to access this.`,
      distance: Math.round(distance),
      allowedRadius: config.locationValidation.data.radius,
    });
  }

  req.guestLocation = { lat, lng, distance: Math.round(distance) };

  next();
};
