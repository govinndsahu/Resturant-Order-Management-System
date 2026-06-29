import axios from "axios";

export const getProductsApi = async (backendUrl) => {
  const { data } = await axios.get(`${backendUrl}products`);
  return { data };
};

export const createProductApi = async (productData, backendUrl) => {
  const { data } = await axios.post(
    `${backendUrl}products/create`,
    productData,
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    },
  );
  return { data };
};

export const uploadImageApi = async (id, formData, backendUrl) => {
  const { data } = await axios.post(
    `${backendUrl}products/upload-image/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    },
  );
  return { data };
};

export const updateProductApi = async (id, productData, backendUrl) => {
  const { data } = await axios.put(
    `${backendUrl}products/update/${id}`,
    productData,
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    },
  );
  return { data };
};

export const deleteProductApi = async (id, backendUrl) => {
  const { data } = await axios.delete(
    `${backendUrl}products/delete/${id}`,
    {
      withCredentials: true,
    },
  );
  return { data };
};
