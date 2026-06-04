// Eiken Practice — Service Worker
// Cache-first strategy: serve from cache, update in background

const CACHE_NAME = 'eiken-practice-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/questions.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;800&display=swap'
];

// Install: pre-cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pre-caching assets');
      // Cache local assets (fail fast on error)
      const localAssets = ASSETS.filter(a => !a.startsWith('http'));
      const remoteAssets = ASSETS.filter(a => a.startsWith('http'));
      return cache.addAll(localAssets).then(() =>
        // Remote fonts: cache best-effort (don't block install)
        Promise.allSettled(remoteAssets.map(url =>
          fetch(url).then(r => cache.put(url, r)).catch(() => {})
        ))
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== CACHE_NAME)
        .map(k => { console.log('[SW] Deleting old cache:', k); return caches.delete(k); })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first, fall back to network
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        // Serve from cache, refresh in background
        const refresh = fetch(event.request).then(response => {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
          }
          return response;
        }).catch(() => {});
        return cached;
      }
      // Not in cache — try network
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
        return response;
      }).catch(() => caches.match('/index.html')); // offline fallback
    })
  );
});
