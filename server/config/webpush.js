import webpush from "web-push";

export const pushNotificationSetup = () => {
  webpush.setVapidDetails(
    "mailto:example@example.com",
    process.env.WEB_PUSH_PUBLIC_KEY,
    process.env.WEB_PUSH_PRIVATE_KEY,
  );
};
