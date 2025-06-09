const CACHE_NAME = 'exercise-converter-cache-v0.1.0';
const URLS_TO_CACHE = [
  '/exercise-converter/index.html',
  '/exercise-converter/css/styles.css',
  '/exercise-converter/js/app.js',
  '/exercise-converter/manifest.webmanifest',
  '/exercise-converter/img/favicon.ico',
  '/exercise-converter/img/icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        })
      );
    })
  );
});
