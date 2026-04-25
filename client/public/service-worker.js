/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// client/public/service-worker.js

self.addEventListener("install", (event) => {
  console.log("🛠️ Service Worker installing...");
  self.skipWaiting(); // 🔥 force activate immediately
});

self.addEventListener("activate", async (event) => {
  console.log("✅ Service Worker activated");
  event.waitUntil(self.clients.claim()); // 🔥 take control immediately
});

self.addEventListener("push", function (event) {
  if (!event.data) return;

  event.waitUntil((async () => {
    let data;

    try {
      data = event.data.json();
      console.log("✅ JSON payload:", data);
    } catch (err) {
      console.warn("⚠️ Not JSON, using text");

      const text = await event.data.text(); // ✅ FIX
      data = {
        title: "Notification",
        body: text,
      };
    }

    const options = {
      body: data.body || "",
      icon: data.icon || "/dehaatnews.png",
      image: data.image || "/dehaatnews.png",
      badge: "/dehaatnews.png",
      data: { url: data.url || "/" },
    };

    console.log("🔥 SHOWING NOTIFICATION:", data);

    await self.registration.showNotification(
      data.title || "New Article",
      options
    );
  })());
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          // if a tab is already open with the URL, focus it
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // otherwise open a new tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
