import axios from "axios";

export const getCategoriesApi = async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URI}/categories`,
  );
  return { data };
};

export const createCategoryApi = async (categoryName, serialNumber) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URI}/categories/create`,
    { name: categoryName, sn: serialNumber },
    {
      withCredentials: true,
    },
  );
  return { data };
};

export const updateCategoryApi = async (id, categoryName, serialNumber) => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_API_URI}/categories/update/${id}`,
    { name: categoryName, sn: serialNumber },
    {
      withCredentials: true,
    },
  );
  return { data };
};

export const deleteCategoryApi = async (id) => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_API_URI}/categories/delete/${id}`,
    {
      withCredentials: true,
    },
  );
  return { data };
};
