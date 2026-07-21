import axios from "axios";

export const enableLocationValidationApi = async (payload, backendUrl) => {
  const { data } = await axios.post(
    `${backendUrl}configuration/enable/location/validation`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    },
  );
  return { data };
};

export const disableLocationValidationApi = async (backendUrl) => {
  const { data } = await axios.post(
    `${backendUrl}configuration/disable/location/validation`,
    {},
    {
      withCredentials: true,
    },
  );
  return { data };
};

export const getLocationValidationConfigApi = async (backendUrl) => {
  const { data } = await axios.get(
    `${backendUrl}configuration/get/location/validation/config`,
    {
      withCredentials: true,
    },
  );
  return { data };
};
