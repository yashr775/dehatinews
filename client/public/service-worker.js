// client/public/service-worker.js

self.addEventListener("push", function (event) {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch (err) {
    console.error("push parse error", err);
    return;
  }

  const options = {
    body: data.body || "",
    icon: data.icon || "/dehaatnews.png",
    image: data.image || "/dehaatnews.png",
    badge: "/dehaatnews.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "New Article", options)
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
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
    })
  );
});
