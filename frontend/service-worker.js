// service-worker.js

const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/css/*',  // Замените на актуальный путь к вашему CSS
  '/static/js/*',    // Замените на актуальный путь к вашему JS
  '/images/*',  // Пример изображения
  // Добавьте другие ресурсы, которые нужно закешировать
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Возвращаем ресурс из кэша
        }
        return fetch(event.request); // Если ресурса нет в кэше, загружаем его с сервера
      })
  );
});
