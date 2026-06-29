import axios from "axios";

export const getAppDataApi = async (appName) => {
  const { data } = await axios.get(
    `https://darling-eject-catty.ngrok-free.dev/menu/get/${appName}`,
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    },
  );
  return { data };
};
