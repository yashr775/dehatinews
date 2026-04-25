import { useEffect, useRef } from "react";

const NotificationSetup = () => {
  const initialized = useRef(false);
  const permission = Notification.permission;
  console.log("🔔 Current permission:", permission);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const registerServiceWorker = async () => {
      try {
        if (!("serviceWorker" in navigator)) return;

        const sw = await navigator.serviceWorker.register("/service-worker.js");
        console.log("✅ Service Worker registered:", sw);

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const applicationServerKey = urlBase64ToUint8Array(
          import.meta.env.VITE_PUBLIC_VAPID_KEY
        );

        let subscription = await sw.pushManager.getSubscription();

        if (subscription) {
          console.log("✅ Using existing subscription:", subscription);
        } else {
          subscription = await sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey,
          });

          console.log("📩 New subscription created:", subscription);
        }

        // send to backend
        await fetch(
          `${import.meta.env.VITE_SERVER}/api/v1/notifications/subscribe`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subscription),
          }
        );

        console.log("📌 Subscription saved to server!");
      } catch (err) {
        console.error("❌ Notification setup error:", err);
      }
    };

    registerServiceWorker();
  }, []);

  function urlBase64ToUint8Array(base64String) {
    if (!base64String) {
      throw new Error("❌ Missing VAPID key");
    }

    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
  }

  return null;
};

export default NotificationSetup;