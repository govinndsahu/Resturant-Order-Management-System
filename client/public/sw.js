const cacheName = "menu-app-v2";

const staticAssets = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/DgDine-icon-192.png",
  "/DgDine-icon-512.png",
];

self.addEventListener("install", async () => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);

  // ✅ Skip non-HTTP and non-GET requests (fixes chrome-extension error)
  if (!req.url.startsWith("http") || req.method !== "GET") {
    return;
  }

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;

  try {
    return await fetch(req);
  } catch {
    // ✅ Never return undefined
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
    // ✅ Never return undefined
    return (
      cached ||
      new Response("Network error and no cache available", {
        status: 408,
        headers: { "Content-Type": "text/plain" },
      })
    );
  }
}

// ✅ Optional: Listen for push events (requires backend implementation)

// Show notification when push is received
self.addEventListener("push", (e) => {
  const data = e.data?.json() ?? {
    title: "Menu App",
    body: "You have a new notification!",
  };

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/squarelogo.png",
      badge: "/squarelogo.png",
      data: { url: data.url || "/" }, // URL to open on click
    }),
  );
});

// Handle notification click
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url));
});
