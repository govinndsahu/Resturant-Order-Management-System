import axios from "axios";

export const getProductsApi = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_URI}/products`);
  return { data };
};

export const createProductApi = async (productData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URI}/products/create`,
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

export const uploadImageApi = async (id, formData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URI}/products/upload-image/${id}`,
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

export const updateProductApi = async (id, productData) => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_API_URI}/products/update/${id}`,
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

export const deleteProductApi = async (id) => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_API_URI}/products/delete/${id}`,
    {
      withCredentials: true,
    },
  );
  return { data };
};
