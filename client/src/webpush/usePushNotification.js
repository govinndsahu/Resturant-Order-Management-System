import { saveSubscriberApi } from "../apis/pushSubscriptionApis";

const PUBLIC_VAPID_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY;

// Convert VAPID key to Uint8Array (required format)
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export async function subscribeToPush() {
  try {
    console.log("yes working...");

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push not supported");
      return null;
    }

    // Step 1: Get the active service worker
    const registration = await navigator.serviceWorker.ready;

    if (!registration) {
      console.log("No SW found, registering...");
      registration = await navigator.serviceWorker.register("/sw.js"); // 👈 adjust path
    }

    await waitForServiceWorker(registration);

    console.log("working...");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Permission denied");
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) await subscription.unsubscribe();
      return null;
    }

    // Step 5: Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    });

    // Step 6: Send subscription to your backend
    await saveSubscriberApi(subscription);

    return subscription;
  } catch (err) {
    console.error("Subscription failed:", err);
    return null;
  }
}
