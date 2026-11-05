import axios from "axios";

export const getAppDataApi = async (appId) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_DGDINE_BACKEND_URL}/menu/get/${appId}`,
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    },
  );
  return { data };
};

export const getArchivedOrdersApi = async (backendUrl) => {
  const { data } = await axios.get(`${backendUrl}orders/get/archives`, {
    withCredentials: true,
  });
  return { data };
};
