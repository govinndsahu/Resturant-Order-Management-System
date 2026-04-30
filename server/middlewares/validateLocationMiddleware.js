import { getDistanceInMeters } from "../utils/utils.js";

const RESTAURANT = {
  name: "My Restaurant",
  lat: 22.00293751611305, // ← Replace with your restaurant's latitude
  lng: 82.10443740281173, // ← Replace with your restaurant's longitude
  radiusMeters: 50, // ← Allowed radius (50 meters recommended)
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
