import axios from "axios";

export const getHistoriesApi = async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URI}/histories`,
    {
      withCredentials: true,
    },
  );
  return { data };
};

export const createHistoriesApi = async (order) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URI}/histories/create`,
    { order },
    {
      withCredentials: true,
    },
  );
  return { data };
};

export const deleteHistoriesApi = async (id) => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_API_URI}/histories/delete/${id}`,
    {
      withCredentials: true,
    },
  );
  return { data };
};
