const CACHE_NAME = 'bizuxo-cache-v1';
const ASSETS_TO_CACHE = [
  '/bizuxo_teste/',
  '/bizuxo_teste/index.html',
  '/bizuxo_teste/style.css',
  '/bizuxo_teste/js/supabase-cliente.js',
  '/bizuxo_teste/js/auth.js',
  '/bizuxo_teste/js/utils.js',
  '/bizuxo_teste/assets/icons/icon-192.png',
  '/bizuxo_teste/assets/icons/icon-512.png'
];

// Instalação
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Ativação
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interceptação
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
