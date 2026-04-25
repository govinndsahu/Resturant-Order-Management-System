import Session from "../models/sessionModel.js";

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
  if (!sessionId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No session cookie found",
    });
  } else {
    const user = await Session.findOne({ _id: sessionId }).populate("userId");
    if (user.userId.role <= 0) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access denied",
      });
    }
    next();
  }
};
