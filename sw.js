// Eiken Practice — Service Worker
const CACHE_NAME = 'eiken-practice-v2';
const BASE = '/EikenApp';
const ASSETS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/style.css',
  BASE + '/app.js',
  BASE + '/questions.js',
  BASE + '/interview.js',
  BASE + '/manifest.json',
  BASE + '/icons/icon-192.png',
  BASE + '/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;800&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      const local = ASSETS.filter(a => !a.startsWith('http'));
      const remote = ASSETS.filter(a => a.startsWith('http'));
      return cache.addAll(local).then(() =>
        Promise.allSettled(remote.map(url =>
          fetch(url).then(r => cache.put(url, r)).catch(() => {})
        ))
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        fetch(event.request).then(r => {
          if (r && r.status === 200)
            caches.open(CACHE_NAME).then(c => c.put(event.request, r.clone()));
        }).catch(() => {});
        return cached;
      }
      return fetch(event.request).then(r => {
        if (!r || r.status !== 200 || r.type === 'opaque') return r;
        caches.open(CACHE_NAME).then(c => c.put(event.request, r.clone()));
        return r;
      }).catch(() => caches.match(BASE + '/index.html'));
    })
  );
});
