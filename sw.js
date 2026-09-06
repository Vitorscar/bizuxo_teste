const CACHE_NAME = 'bizuxo-cache-v1';
const BASE_PATH = '/bizuxo_teste/';

// Lista de arquivos que realmente existem no seu projeto
const ASSETS_TO_CACHE = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'style.css',
  BASE_PATH + 'js/supabase-cliente.js',
  BASE_PATH + 'js/auth.js',
  BASE_PATH + 'js/utils.js',
  BASE_PATH + 'js/app.js',
  BASE_PATH + 'assets/icons/icon-192.png',
  BASE_PATH + 'assets/icons/icon-512.png'
  // Adicione somente os arquivos que você tem certeza que existem
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Usa Promise.allSettled para não falhar tudo se um arquivo falhar
      const results = await Promise.allSettled(
        ASSETS_TO_CACHE.map(url => cache.add(url))
      );
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn(`Falha ao cachear: ${ASSETS_TO_CACHE[index]}`, result.reason);
        }
      });
    })
  );
});