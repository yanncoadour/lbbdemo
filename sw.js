/**
 * Service Worker - La Belle Bretagne
 * Cache intelligent et mode offline
 */

const CACHE_NAME = 'la-belle-bretagne-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/config.js',
    '/js/utils.js',
    '/js/map.js',
    '/data/pois.json',
    '/manifest.json',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Ressources à ne jamais mettre en cache
const NEVER_CACHE = [
    '/admin/',
    '/api/analytics'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
    console.log('[SW] Installation...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Cache des ressources statiques');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[SW] Installation terminée');
                return self.skipWaiting(); // Active immédiatement
            })
            .catch((error) => {
                console.error('[SW] Erreur installation:', error);
            })
    );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    console.log('[SW] Activation...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Supprimer les anciens caches
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('[SW] Suppression ancien cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Activation terminée');
                return self.clients.claim(); // Contrôle immédiat
            })
    );
});

// Stratégies de cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorer les requêtes non-HTTP
    if (!request.url.startsWith('http')) return;

    // Ignorer les ressources à ne jamais mettre en cache
    if (NEVER_CACHE.some(path => url.pathname.includes(path))) {
        return;
    }

    // Stratégie selon le type de ressource
    if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js') || url.pathname.includes('font')) {
        // Cache First pour CSS/JS/Fonts
        event.respondWith(cacheFirst(request));
    } else if (url.pathname.endsWith('.json') || url.pathname.includes('data/')) {
        // Network First pour les données
        event.respondWith(networkFirst(request));
    } else if (url.pathname.includes('assets/img/') || url.pathname.includes('.jpg') || url.pathname.includes('.png')) {
        // Cache First pour les images
        event.respondWith(cacheFirst(request));
    } else {
        // Stale While Revalidate pour les pages HTML
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Stratégie Cache First (pour ressources statiques)
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());

        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache First failed:', error);
        return new Response('Offline - Ressource non disponible', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Stratégie Network First (pour données dynamiques)
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, trying cache...');
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        return new Response('Offline - Données non disponibles', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Stratégie Stale While Revalidate (pour HTML)
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);

    // Mise à jour en arrière-plan
    const networkResponse = fetch(request).then((response) => {
        cache.put(request, response.clone());
        return response;
    });

    // Retourner immédiatement le cache si disponible
    return cachedResponse || networkResponse;
}

// Nettoyage périodique du cache
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLEAN_CACHE') {
        cleanOldCache();
    }
});

async function cleanOldCache() {
    const cache = await caches.open(DYNAMIC_CACHE);
    const keys = await cache.keys();

    // Garder seulement les 50 dernières entrées
    if (keys.length > 50) {
        const keysToDelete = keys.slice(0, keys.length - 50);
        await Promise.all(keysToDelete.map(key => cache.delete(key)));
        console.log('[SW] Cache nettoyé:', keysToDelete.length, 'entrées supprimées');
    }
}