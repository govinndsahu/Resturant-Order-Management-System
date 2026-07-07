import axios from "axios";

export const getAppDataApi = async (appId) => {
  const { data } = await axios.get(
    `https://darling-eject-catty.ngrok-free.dev/menu/get/${appId}`,
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    },
  );
  return { data };
};
