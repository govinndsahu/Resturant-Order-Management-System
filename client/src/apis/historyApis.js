import axios from "axios";

export const getHistoriesApi = async (backendUrl) => {
  const { data } = await axios.get(`${backendUrl}histories`, {
    withCredentials: true,
  });
  return { data };
};

export const createHistoriesApi = async (order, backendUrl) => {
  const { data } = await axios.post(
    `${backendUrl}histories/create`,
    { order },
    {
      withCredentials: true,
    },
  );
  return { data };
};

export const deleteHistoryApi = async (id, backendUrl) => {
  const { data } = await axios.delete(`${backendUrl}histories/delete/${id}`, {
    withCredentials: true,
  });
  return { data };
};

export const deleteHistoriesApi = async (ids, backendUrl) => {
  const { data } = await axios.delete(`${backendUrl}histories/delete`, {
    withCredentials: true,
    data: { ids },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return { data };
};
