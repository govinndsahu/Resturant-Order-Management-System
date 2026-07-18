import axios from "axios";

export const getProductsApi = async (backendUrl) => {
  const { data } = await axios.get(`${backendUrl}products`);
  return { data };
};

export const createProductApi = async (productData, backendUrl, menuId) => {
  const { data } = await axios.post(
    `${backendUrl}products/create`,
    { ...productData, id: menuId },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    },
  );
  return { data };
};

export const uploadImageApi = async (id, formData, backendUrl, menuId) => {
  const { data } = await axios.post(
    `${backendUrl}products/upload-image/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        id: menuId,
      },
      withCredentials: true,
    },
  );
  return { data };
};

export const updateProductApi = async (id, productData, backendUrl, menuId) => {
  const { data } = await axios.put(
    `${backendUrl}products/update/${id}`,
    { ...productData, id: menuId },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    },
  );
  return { data };
};

export const deleteProductApi = async (id, backendUrl, menuId) => {
  const { data } = await axios.delete(`${backendUrl}products/delete/${id}`, {
    withCredentials: true,
    data: { id: menuId },
  });
  return { data };
};
