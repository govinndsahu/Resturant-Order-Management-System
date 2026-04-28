import axios from "axios";

export const userRegisterApi = async (formData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URI}/users/register`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    },
  );
  return { data };
};

export const userLoginApi = async (formData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URI}/users/login`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    },
  );
  return { data };
};

export const userLogoutApi = async () => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URI}/users/logout`,
    {},
    { withCredentials: true },
  );
  return { data };
};

export const getUsersApi = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_URI}/users`, {
    withCredentials: true,
  });
  return { data };
};

export const updateUserApi = async (userId) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URI}/users/update/${userId}`,
    {},
    {
      withCredentials: true,
    },
  );
  return { data };
};

export const deleteUserApi = async (userId) => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_API_URI}/users/delete/${userId}`,
    { withCredentials: true },
  );
  return { data };
};
