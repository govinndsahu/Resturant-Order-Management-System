import axios from "axios";

export const getOrdersApi = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_URI}/orders`, {
    withCredentials: true,
  });
  return { data };
};

export const createOrderApi = async (orderData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URI}/orders/create`,
    orderData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return { data };
};

export const deleteOrderApi = async (id) => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_API_URI}/orders/delete/${id}`,
    {
      withCredentials: true,
    },
  );
  return { data };
};

export const deleteOrdersApi = async (ids) => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_API_URI}/orders/delete`,
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
