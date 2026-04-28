import axios from "axios";

export const sendNotificationApi = async () => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URI}/push-subscriptions/send-notification`,
  );
  return { data };
};

export const saveSubscriberApi = async (subscription) => {
  await fetch(`${import.meta.env.VITE_API_URI}/push-subscriptions/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
    credentials: "include", // Include cookies if needed
  });
};
