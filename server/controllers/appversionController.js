import z from "zod/v4";

export const updateAppVersion = async (req, res, next) => {
  const { appVersion } = req.body;

  try {
    const version = await Version.findOne();

    if (!version) {
      const newVersion = new Version({ version: 1 });
      await newVersion.save();
    } else {
      version.version = appVersion;
      await version.save();
    }

    return res.end("ok");
  } catch (error) {
    next(error);
  }
};
