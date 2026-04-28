import cors from "cors";

const whitelist = [process.env.CLIENT_URL, "http://192.168.1.2:5173"];

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
    sameSite: "lax",
    maxAge: 60 * 1000 * 60 * 24 * 365, // 365 days
  });
