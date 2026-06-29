import axios from "axios";

export const getOrdersApi = async (backendUrl) => {
  const { data } = await axios.get(`${backendUrl}orders`, {
    withCredentials: true,
  });
  return { data };
};

export const createOrderApi = async (orderData, backendUrl) => {
  const { data } = await axios.post(
    `${backendUrl}orders/create`,
    orderData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return { data };
};

export const deleteOrderApi = async (id, backendUrl) => {
  const { data } = await axios.delete(
    `${backendUrl}orders/delete/${id}`,
    {
      withCredentials: true,
    },
  );
  return { data };
};

export const deleteOrdersApi = async (ids, backendUrl) => {
  const { data } = await axios.delete(
    `${backendUrl}orders/delete`,
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
