const CACHE_NAME = 'resgate-despesas-v2'; // Atualize esse número sempre que quiser forçar uma atualização

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força o novo Service Worker a assumir imediatamente
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()); // Pega o controle de todas as abas abertas
});

self.addEventListener('fetch', (event) => {
  // Estratégia Network-First: Tenta pegar da internet, se falhar (offline), pega do cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se conseguiu baixar da internet, atualiza o cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Se falhou (offline), retorna do cache
        return caches.match(event.request);
      })
  );
});
