// PWA Cache Buster - Generated at 2025-09-03T16:24:07.458Z
console.log('PWA Cache Buster loaded - forcing update...');

// Force service worker update
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistration().then(registration => {
    if (registration) {
      registration.update();
      console.log('Service Worker update forced');
    }
  });
}

// Clear caches
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
      caches.delete(cacheName);
      console.log('Cache cleared:', cacheName);
    });
  });
}