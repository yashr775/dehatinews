import { useEffect } from "react";

const NotificationSetup = () => {
  useEffect(() => {
    const registerServiceWorker = async () => {
      if (!("serviceWorker" in navigator)) return;

      const sw = await navigator.serviceWorker.register("/service-worker.js");
      console.log("Service Worker registered:", sw);

      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const applicationServerKey = urlBase64ToUint8Array(import.meta.env.VITE_PUBLIC_VAPID_KEY);

      const subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      console.log("📩 Subscription created:", subscription);

      await fetch(`${import.meta.env.VITE_SERVER}/api/v1/notifications/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });

      console.log("📌 Subscription saved to server!");
    };

    registerServiceWorker();
  }, []);

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return null;
};

export default NotificationSetup;
