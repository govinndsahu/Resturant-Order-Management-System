import axios from "axios";

export const getAppVersionApi = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_URI}/version`);
  return { data };
};
