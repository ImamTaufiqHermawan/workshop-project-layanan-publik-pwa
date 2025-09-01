// Minimal Service Worker untuk PWA Workshop
// Hanya handle basic PWA features, tidak ada complex caching

const CACHE_NAME = "layanan-publik-simple";

// Install event - minimal caching
self.addEventListener("install", (event) => {
  console.log("Service Worker installed - minimal mode");
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up
self.addEventListener("activate", (event) => {
  console.log("Service Worker activated - minimal mode");
  // Claim all clients immediately
  event.waitUntil(self.clients.claim());
});

// Fetch event - NO CACHING for API, minimal for others
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // IMPORTANT: NEVER cache API requests
  if (url.pathname.startsWith("/api/")) {
    // Let the request go through normally, no caching
    return;
  }

  // For non-API requests, minimal handling
  if (request.destination === "document") {
    // HTML pages - no caching, always fresh
    return;
  }

  // For static assets, minimal caching
  if (request.destination === "style" || request.destination === "script") {
    // Let browser handle caching naturally
    return;
  }

  // For other resources, no caching
  return;
});

// Push notification handling (keep for PWA features)
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Update status pengajuan Anda",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Lihat Detail",
        icon: "/icon-192.png",
      },
      {
        action: "close",
        title: "Tutup",
        icon: "/icon-192.png",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("Layanan Publik PWA", options)
  );
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/public?tab=status"));
  }
});

// Message handling for simple operations
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
