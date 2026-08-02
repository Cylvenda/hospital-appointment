/* DPAMS service worker: public app-shell caching only. Never cache API or private health data. */
const VERSION = "dpams-v1";
const STATIC_CACHE = `${VERSION}-static`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const APP_SHELL = [
  "/offline",
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];
const PRIVATE_PATH = /(?:\/api\/|dashboard|appointment|patient|doctor|profile|notification|laboratory|report|prescription|document|attachment|upload|consultation|queue)/i;
const STATIC_DESTINATIONS = new Set(["style", "script", "font", "image"]);

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("dpams-") && ![STATIC_CACHE, RUNTIME_CACHE].includes(key)).map((key) => caches.delete(key)))),
    self.clients.claim(),
  ]));
});

function isSafe(request, url) {
  return request.method === "GET" && url.origin === self.location.origin &&
    !PRIVATE_PATH.test(url.pathname) && !request.headers.has("authorization") &&
    request.credentials !== "include";
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && response.type === "basic") {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || PRIVATE_PATH.test(url.pathname) || request.headers.has("authorization")) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("/offline")));
    return;
  }
  if (isSafe(request, url) && (url.pathname.startsWith("/_next/static/") || STATIC_DESTINATIONS.has(request.destination))) {
    event.respondWith(cacheFirst(request));
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
  if (event.data?.type === "CLEAR_PRIVATE_DATA") {
    event.waitUntil(caches.delete(RUNTIME_CACHE));
  }
});

// Extension points only: payload handling and server-side subscription are intentionally deferred.
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(self.registration.showNotification(data.title || "DPAMS", {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    data: { url: data.url || "/" },
  }));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data?.url || "/"));
});

// Future queued writes must be encrypted, user-scoped, and explicitly opted in before registration.
self.addEventListener("sync", (event) => {
  if (event.tag === "dpams-sync") {
    event.waitUntil(Promise.resolve());
  }
});
