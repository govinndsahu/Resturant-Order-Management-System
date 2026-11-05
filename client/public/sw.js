const cacheName = "menu-app-v3";

const staticAssets = [
  "/manifest.webmanifest",
  "/DgDine-icon-192.png",
  "/DgDine-icon-512.png",
];

self.addEventListener("install", async () => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      // clean up old cache versions
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== cacheName).map((k) => caches.delete(k)),
      );
      self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);

  if (!req.url.startsWith("http") || req.method !== "GET") {
    return;
  }

  // Navigation requests (HTML/app shell) → always network-first
  if (req.mode === "navigate") {
    e.respondWith(networkFirst(req));
    return;
  }

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function networkFirst(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch {
    const cached = await cache.match(req);
    return (
      cached ||
      new Response("You are offline", {
        status: 503,
        headers: { "Content-Type": "text/plain" },
      })
    );
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;

  try {
    return await fetch(req);
  } catch {
    return new Response("You are offline", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch {
    const cached = await cache.match(req);
    return (
      cached ||
      new Response("Network error and no cache available", {
        status: 408,
        headers: { "Content-Type": "text/plain" },
      })
    );
  }
}

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "New Order", body: event.data?.text() || "" };
  }

  const title = data.title || "Notification";
  const options = {
    body: data.body || "",
    icon: "/DgDine-icon-192.png",
    badge: "/DgDine-icon-192.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    }),
  );
});
