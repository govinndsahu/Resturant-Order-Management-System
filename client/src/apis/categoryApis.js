import axios from "axios";

export const getCategoriesApi = async (backendUrl) => {
  const { data } = await axios.get(`${backendUrl}categories`);
  return { data };
};

export const createCategoryApi = async (
  categoryName,
  serialNumber,
  backendUrl,
  menuId,
) => {
  const { data } = await axios.post(
    `${backendUrl}categories/create`,
    { name: categoryName, sn: serialNumber, id: menuId },
    {
      withCredentials: true,
    },
  );
  return { data };
};

export const updateCategoryApi = async (
  id,
  categoryName,
  serialNumber,
  backendUrl,
  menuId,
) => {
  const { data } = await axios.put(
    `${backendUrl}categories/update/${id}`,
    { name: categoryName, sn: serialNumber, id: menuId },
    {
      withCredentials: true,
    },
  );
  return { data };
};

export const deleteCategoryApi = async (id, backendUrl, menuId) => {
  const { data } = await axios.delete(`${backendUrl}categories/delete/${id}`, {
    withCredentials: true,
    data: { id: menuId },
  });
  return { data };
};
