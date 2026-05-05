import { useEffect, useRef, useState } from "react";
import { subscribeToPush } from "../webpush/usePushNotification.js";
import Loader from "./Loader.jsx";

export default function NotificationButton() {
  const [loader, setLoader] = useState(false);

  const notificationRef = useRef(null);

  const handleSubscribe = async () => {
    setLoader(true);

    const sub = await subscribeToPush();

    if (sub) {
      alert("✅ Subscribed to notifications!");
    } else {
      alert("❌ Could not subscribe.");
    }

    setLoader(false);
  };

  useEffect(() => {
    (async function () {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        notificationRef.current.style.display = "none";
      }
    })();
  }, []);

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <button
          ref={notificationRef}
          className="notification-button"
          onClick={handleSubscribe}>
          🔔 Enable Notifications
        </button>
      )}
    </>
  );
}
