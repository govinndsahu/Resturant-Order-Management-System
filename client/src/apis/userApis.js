import axios from "axios";

export const userRegisterApi = async (formData, backendUrl) => {
  const { data } = await axios.post(`${backendUrl}users/register`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return { data };
};

export const userLoginApi = async (formData, backendUrl) => {
  const { data } = await axios.post(`${backendUrl}users/login`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return { data };
};

export const userLogoutApi = async (backendUrl) => {
  const { data } = await axios.post(
    `${backendUrl}users/logout`,
    {},
    { withCredentials: true },
  );
  return { data };
};

export const getUsersApi = async (backendUrl) => {
  const { data } = await axios.get(`${backendUrl}users`, {
    withCredentials: true,
  });
  return { data };
};

export const updateUserApi = async (userId, backendUrl) => {
  const { data } = await axios.post(
    `${backendUrl}users/update/${userId}`,
    {},
    {
      withCredentials: true,
    },
  );
  return { data };
};

export const deleteUserApi = async (userId, backendUrl) => {
  const { data } = await axios.delete(`${backendUrl}users/delete/${userId}`, {
    withCredentials: true,
  });
  return { data };
};
