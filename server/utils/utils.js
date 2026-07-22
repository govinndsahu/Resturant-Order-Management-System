import cors from "cors";
import sharp from "sharp";

const whitelist = [
  process.env.CLIENT_URL,
  "http://localhost:5174",
  "http://localhost:5173",
  "https://menu.dgdine.in",
];

export const handleCors = () => {
  return cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  });
};

export const globalError = (err, req, res, next) => {
  console.log(err);
  return res.status(err.status || 500).json({
    error: "Something went wrong",
  });
};

export const handleAppListen = async (app, port, connectDB) => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export const setCookie = (res, session) =>
  res.cookie("sid", session._id.toString(), {
    httpOnly: true,
    secure: true,
    signed: true,
    sameSite: "none",
    maxAge: 60 * 1000 * 60 * 24 * 365, // 365 days
  });

export const compressToTargetSize = async (
  buffer,
  targetKB = 500,
  format = "webp",
) => {
  const targetBytes = targetKB * 1024;
  let quality = 80;
  let output;

  // Try reducing quality first
  for (let i = 0; i < 8; i++) {
    output = await sharp(buffer)
      .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
      [format]({ quality })
      .toBuffer();

    if (output.length <= targetBytes || quality <= 20) break;
    quality -= 10;
  }

  // If still too big even at low quality, start shrinking dimensions too
  let width = 1600;
  while (output.length > targetBytes && width > 400) {
    width -= 200;
    output = await sharp(buffer)
      .resize(width, width, { fit: "inside", withoutEnlargement: true })
      [format]({ quality: 60 })
      .toBuffer();
  }

  return output;
};

export const getDistanceInMeters = (lat1, lng1, lat2, lng2) => {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const handleChargeEvent = async ({ req, count }) => {
  if (req.planId === process.env.RAZORPAY_PLAN_STARTER) {
    count.count = 0;
    count.maxCount = 1000;
    count.maxItemCount = 50;
    count.willReset = false;
    await count.save();
  } else if (req.planId === process.env.RAZORPAY_PLAN_GROWTH) {
    count.count = 0;
    count.maxCount = 5000;
    count.maxItemCount = 100;
    count.willReset = false;
    await count.save();
  } else if (req.planId === process.env.RAZORPAY_PLAN_PRO) {
    count.count = 0;
    count.maxCount = 25000;
    count.maxItemCount = 150;
    count.willReset = false;
    await count.save();
  } else if (req.planId === process.env.RAZORPAY_PLAN_ENTERPRISE) {
    count.count = 0;
    count.maxCount = 50000;
    count.maxItemCount = 300;
    count.willReset = false;
    await count.save();
  }
};

export const handleCancelEvent = async ({ count, payload }) => {
  count.willReset = true;
  count.resetDate = payload.currentEnd;
  await count.save();
};

export const handlePauseEvent = async ({ count, payload }) => {
  count.willReset = true;
  count.resetDate = payload.currentEnd;
  count.count = 0;
  count.maxCount = 100;
  count.maxItemCount = 10;
  await count.save();
};

export const handleResumeEvent = async ({ payload, count }) => {
  count.willReset = false;
  count.resetDate = null;
  count.count = payload.pausedData.count;
  count.maxCount = payload.pausedData.maxCount;
  count.maxItemCount = payload.pausedData.maxItemCount;
  await count.save();
};

export const handlePendingEvent = async ({ payload, count }) => {
  count.willReset = true;
  count.count = 0;
  count.maxCount = 100;
  count.maxItemCount = 10;
  count.resetDate = payload.currentEnd;
  await count.save();
};

export const handleCompletedEvent = async ({ payload, count }) => {
  count.willReset = true;
  count.count = 0;
  count.maxCount = 100;
  count.maxItemCount = 10;
  count.resetDate = payload.currentEnd;
  await count.save();
};
