import Session from "../models/sessionModel.js";

export const setSession = async (req, res, next) => {
  try {
    const sessionId = req.signedCookies.sessionId || null;
    const { tableNumber } = req.body;

    const SESSION_TTL = 1000 * 60 * 60; // 1 hour — keep cookie and DB in sync

    let session = null;

    if (sessionId) {
      session = await Session.findOne({ _id: sessionId, tableNumber });

      // expired -> treat as invalid, clean up
      if (session && session.expiresAt < Date.now()) {
        await Session.findByIdAndDelete(session._id);
        session = null;
      }
    }

    // no cookie, wrong table, or expired -> create a fresh session
    if (!session) {
      session = await Session.create({
        expiresAt: Date.now() + SESSION_TTL,
        tableNumber,
        phone: parseInt(req.body.phoneNumber) || null,
      });

      res.cookie("sessionId", session._id.toString(), {
        httpOnly: true,
        secure: true,
        signed: true,
        maxAge: SESSION_TTL,
      });
    } else {
      // valid session reused -> optional sliding expiry
      session.expiresAt = Date.now() + SESSION_TTL;
      await session.save();
    }

    req.session = session; // downstream middleware reads this
    next();
  } catch (error) {
    next(error);
  }
};
