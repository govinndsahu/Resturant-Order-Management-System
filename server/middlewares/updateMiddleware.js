export const updateVersion = async (req, res, next) => {
  try {
    const id = req.body.id || req.headers.id;

    const response = await fetch(
      `${process.env.DGDINE_BACKEND_URL}/menu/update/version`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      },
    );

    const data = await response.json();

    if (data.success) {
      return next();
    }
    return next();
  } catch (error) {
    next(error);
  }
};
