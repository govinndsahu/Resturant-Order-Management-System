// service-worker.js
const CACHE_NAME = 'product-images-v1';
const IMAGE_PATH = '/uploaded_files/'; // Your image directory
const PLACEHOLDER_URL = '/placeholder.png'; // Add this image to your public folder

// ======================================
// INSTALL: Pre-cache placeholder image
// ======================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.add(PLACEHOLDER_URL))
      .then(() => self.skipWaiting())
  );
});

// ======================================
// ACTIVATE: Clean up old caches
// ======================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
});

// ======================================
// FETCH: Cache-first strategy for images
// ======================================
self.addEventListener('fetch', (event) => {
  try {
    const url = new URL(event.request.url);

    // Skip non-HTTP(S) requests & non-GET requests
    if (!url.protocol.startsWith('http') || event.request.method !== 'GET') return;

    // Handle image requests
    if (url.pathname.includes(IMAGE_PATH)) {
      event.respondWith(
        caches.match(event.request)
          .then(cached => cached || fetchAndCache(event.request))
          .catch(() => caches.match(PLACEHOLDER_URL))
      );
    }
  } catch (error) {
    console.error('Service Worker fetch error:', error);
  }
});

// ======================
// Helper Functions
// ======================
async function fetchAndCache(request) {
  const response = await fetch(request);
  
  // Clone response before reading (required for caching)
  const clone = response.clone();
  
  caches.open(CACHE_NAME)
    .then(cache => cache.put(request, clone))
    .catch(err => console.warn('Failed to cache:', request.url, err));

  return response;
}