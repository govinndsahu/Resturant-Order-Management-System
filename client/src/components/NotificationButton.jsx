import { subscribeToPush } from "../webpush/usePushNotification.js";

export default function NotificationButton() {
  const handleSubscribe = async () => {
    const sub = await subscribeToPush();

    if (sub) {
      alert("✅ Subscribed to notifications!");
    } else {
      
      alert("❌ Could not subscribe.");
    }
  };

  return <button onClick={handleSubscribe}>🔔 Enable Notifications</button>;
}
