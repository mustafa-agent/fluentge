// FluentGe Service Worker — lightweight cache-first for static assets
const CACHE = 'fluentge-v2';
const PRECACHE = ['/', '/flashcards/', '/grammar/', '/games/'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(names => 
    Promise.all(names.filter(n => n !== CACHE).map(n => caches.delete(n)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Cache-first for same-origin static assets
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        const fetched = fetch(e.request).then(resp => {
          if (resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return resp;
        }).catch(() => cached);
        return cached || fetched;
      })
    );
  }
});
