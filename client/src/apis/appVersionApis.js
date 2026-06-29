import axios from "axios";

export const getAppVersionApi = async (backendUrl) => {
  const { data } = await axios.get(`${backendUrl}version`);
  return { data };
};
