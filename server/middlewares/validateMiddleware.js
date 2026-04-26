import Session from "../models/sessionModel.js";
import Version from "../models/versionModel.js";

export const isLogedIn = async (req, res, next) => {
  const sessionId = req.signedCookies.sid;
  if (!sessionId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No session cookie found",
    });
  } else {
    const user = await Session.findOne({ _id: sessionId }).populate("userId");
    req.user = user;
    next();
  }
};

export const isAdmin = async (req, res, next) => {
  const sessionId = req.signedCookies.sid;
  if (!sessionId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No session cookie found",
    });
  } else {
    const user = await Session.findOne({ _id: sessionId }).populate("userId");
    if (user.userId.role !== 2) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access denied",
      });
    }
    next();
  }
};

export const isStaff = async (req, res, next) => {
  const sessionId = req.signedCookies.sid;
  console.log(sessionId);
  if (!sessionId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No session cookie found",
    });
  } else {
    const user = await Session.findOne({ _id: sessionId }).populate("userId");
    console.log(user);
    if (user.userId.role <= 0) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access denied",
      });
    }
    next();
  }
};

export const isNewAppVersion = async (req, res, next) => {
  const { appVersion } = req.body;

  try {
    const version = await Version.findOne();

    if (!version) {
      await Version.create({ version: appVersion || 1 });
      return next();
    }

    if (appVersion !== version.version) {
      return res.status(200).json({
        success: false,
        message: "Database is updated.",
        version,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const updateAppVersion = async (req, res, next) => {
  try {
    const appVersion = await Version.findOne();

    if (!appVersion) {
      await Version.create({ version: 1 });
      return next();
    }

    appVersion.version += 1;
    await appVersion.save();

    next();
  } catch (error) {
    next(error);
  }
};
