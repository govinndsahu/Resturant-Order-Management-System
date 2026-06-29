import axios from "axios";

export const sendNotificationApi = async (backendUrl) => {
  const { data } = await axios.post(
    `${backendUrl}push-subscriptions/send-notification`,
  );
  return { data };
};

export const saveSubscriberApi = async (subscription, backendUrl) => {
  await fetch(`${backendUrl}push-subscriptions/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
    credentials: "include", // Include cookies if needed
  });
};
