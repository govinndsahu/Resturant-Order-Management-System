export const preventCaching = (res) => {
  res.set("Cache-Control", "no-store");
  res.status(500).json({ error: "Failed to fetch menu" });
};

export const addCache = ({ res, days }) => {
  res.set(
    "Cache-Control",
    `public, max-age=30, s-maxage=${60 * 60 * 24 * days}`,
  );
};

export const purgeCache = async ({ urls, origin }) => {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/purge_cache`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: urls.map((u) => ({
          url: `${process.env.SERVER_URL}${u}`,
          headers: {
            origin: `https://${origin}`,
          },
        })),
      }),
    },
  );

  const data = await response.json();

  return { data, response };
};
