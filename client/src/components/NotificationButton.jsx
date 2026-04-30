import { subscribeToPush } from "../webpush/usePushNotification.js";

export default function NotificationButton() {
  const handleSubscribe = async () => {
    console.log("is working....?");

    const sub = await subscribeToPush();

    console.log(sub);

    if (sub) {
      alert("✅ Subscribed to notifications!");
    } else {
      alert("❌ Could not subscribe.");
    }
  };

  return (
    <button className="notification-button" onClick={handleSubscribe}>
      🔔 Enable Notifications
    </button>
  );
}
