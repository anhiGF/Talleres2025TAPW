const CACHE_NAME = 'cache-v1';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/main.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    console.log('Realizando Cache...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache realizado correctamente');
                return cache.addAll(FILES_TO_CACHE);
            })
    );
});

// Estrategia Cache-First
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Devuelve la respuesta en caché o hace la petición a red
                return response || fetch(event.request);
            })
    );
});

// Limpieza de cachés antiguos
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});