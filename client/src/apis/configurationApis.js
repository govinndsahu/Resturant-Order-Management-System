import axios from "axios";

export const enableNameValidationApi = async (backendUrl) => {
  const { data } = await axios.post(
    `${backendUrl}configuration/enable/name/validation`,
    {},
    {
      withCredentials: true,
    },
  );
  return { data };
};

export const disableNameValidationApi = async (backendUrl) => {
  const { data } = await axios.post(
    `${backendUrl}configuration/disable/name/validation`,
    {},
    {
      withCredentials: true,
    },
  );
  return { data };
};

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

export const enablePhoneValidationApi = async (backendUrl) => {
  const { data } = await axios.post(
    `${backendUrl}configuration/enable/phone/validation`,
    {},
    {
      withCredentials: true,
    },
  );
  return { data };
};

export const disablePhoneValidationApi = async (backendUrl) => {
  const { data } = await axios.post(
    `${backendUrl}configuration/disable/phone/validation`,
    {},
    {
      withCredentials: true,
    },
  );
  return { data };
};

export const enablePhoneOtpValidationApi = async (payload, backendUrl) => {
  const { data } = await axios.post(
    `${backendUrl}configuration/enable/otp/validation`,
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

export const disablePhoneOtpValidationApi = async (backendUrl) => {
  const { data } = await axios.post(
    `${backendUrl}configuration/disable/otp/validation`,
    {},
    {
      withCredentials: true,
    },
  );
  return { data };
};

export const getConfigurationApi = async (backendUrl) => {
  const { data } = await axios.get(`${backendUrl}configuration/get`, {
    withCredentials: true,
  });
  return { data };
};
