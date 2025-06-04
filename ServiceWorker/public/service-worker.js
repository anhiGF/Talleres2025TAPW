const CACHE_NAME = 'formulario-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/success.html'
];

self.addEventListener('install', event => {
    console.log('Instalando Service Worker');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cacheando archivos');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    console.log('Activando Service Worker');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(name => {
                    if (name !== CACHE_NAME) {
                        console.log('Borrando cache antiguo: ', name);
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request);
                })
        );
    } else if (event.request.method === 'POST' && event.request.url.includes('/submit')) {
        // Manejar solicitudes POST para el formulario
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    // Si falla la conexión, mostrar la página de éxito desde caché
                    return caches.match('/success.html');
                })
        );
    }
});