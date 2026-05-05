import { getDistanceInMeters } from "../utils/utils.js";

const RESTAURANT = {
  name: process.env.RESTAURANT_NAME,
  lat: 22.00284176008031,
  lng: 82.10434669560149,
  radiusMeters: 15,
};

export const validateRestaurantLocation = (req, res, next) => {
  const { lat, lng } = req.body; // Sent from frontend

  // GPS coordinates must be provided
  if (!lat || !lng) {
    return res.status(403).json({
      success: false,
      code: "LOCATION_MISSING",
      message: "Location access is required to use this service.",
    });
  }

  const distance = getDistanceInMeters(
    RESTAURANT.lat,
    RESTAURANT.lng,
    parseFloat(lat),
    parseFloat(lng),
  );

  if (distance > RESTAURANT.radiusMeters) {
    return res.status(403).json({
      success: false,
      code: "OUTSIDE_RESTAURANT",
      message: `You must be inside ${RESTAURANT.name} to access this.`,
      distance: Math.round(distance),
      allowedRadius: RESTAURANT.radiusMeters,
    });
  }

  req.guestLocation = { lat, lng, distance: Math.round(distance) };
  next();
};
