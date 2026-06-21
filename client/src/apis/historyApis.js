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

export const deleteHistoryApi = async (id) => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_API_URI}/histories/delete/${id}`,
    {
      withCredentials: true,
    },
  );
  return { data };
};

export const deleteHistoriesApi = async (ids) => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_API_URI}/histories/delete`,
    {
      withCredentials: true,
      data: { ids },
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return { data };
};
