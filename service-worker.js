const CACHE_NAME = 'site-cache-v1';
const urlsToCache = [
    '/index.html',
    '/app.js',
    '/contact.html',
    '/about.html',
    '/confirmation.html',
    '/style.css',
    '/foto.png',
    '/image.jpg',
    '/Logo192.png',
    '/Logo512.png',
    '/offline.html'
];

// Instal service worker dan caching aset-aset
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Cache terbuka');
            return cache.addAll(urlsToCache)
                .then(() => self.skipWaiting())
                .catch(error => console.error('Gagal melakukan caching: ', error));
        })
    );
});

// Aktifkan service worker dan hapus cache lama
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Menghapus cache lama:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
        .then(() => self.clients.claim()));
});
// Ambil aset dari cache, dan jika gagal ambil halaman offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response; // Gunakan cache jika ada
            }
            return fetch(event.request).catch(() => {
                // Jika fetch gagal, tampilkan halaman offline
                return caches.match('/offline.html');
            });
        })
    );
});
