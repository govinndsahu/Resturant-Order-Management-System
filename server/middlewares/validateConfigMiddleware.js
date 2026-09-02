import Configuration from "../models/configurationModel.js";
import Session from "../models/sessionModel.js";
import { getDistanceInMeters, veriryOtp } from "../utils/utils.js";
import z from "zod/v4";

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
  req.config = config;

  next();
};

export const validatePhoneNumber = async (req, res, next) => {
  try {
    const config = await Configuration.findOne();

    if (
      !config ||
      !config.customerPhoneValidation ||
      !config.customerPhoneValidation?.doValidate
    ) {
      return next();
    }

    if (!req.body.phoneNumber) {
      return res.status(400).json({
        success: false,
        code: "PHONE_NUMBER_MISSING",
        message: "Phone number is required.",
      });
    }

    const { data: phoneNumber, success } = z
      .string()
      .min(10)
      .safeParse(req.body.phoneNumber);

    if (!success) {
      return res.status(400).json({
        success: false,
        error: "PHONE_NUMBER_NOT_FOUND.",
      });
    }

    if (req.session.phone === null) {
      req.session.phone = parseInt(phoneNumber.slice(1, -1));
      await req.session.save();
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const validateOtp = async (req, res, next) => {
  try {
    const config = await Configuration.findOne();

    if (
      !config ||
      !config.phoneOtpValidation ||
      !config.phoneOtpValidation?.doValidate
    ) {
      return next();
    }

    if (req.session.isVerified === false) {
      if (!req.body.accessToken.length) {
        return res.status(400).json({
          success: false,
          error: "OTP_NOT_VERIFIED",
        });
      }

      const verifyResponse = await veriryOtp({
        accessToken: req.body.accessToken,
        authkey: config.phoneOtpValidation?.data.authKey,
      });

      if (
        verifyResponse.type !== "success" &&
        verifyResponse.message !== "91" + req.session.phone.toString()
      ) {
        return res.status(400).json({
          success: false,
          error: "OTP_NOT_VERIFIED",
        });
      }

      req.session.isVerified = true;
      req.session.expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 365;
      await req.session.save();

      res.cookie("sessionId", req.session._id.toString(), {
        httpOnly: true,
        secure: true,
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
