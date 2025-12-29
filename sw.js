/**
 * Service Worker for AI Interior Design Website
 * Provides offline support and caching strategy
 */

const CACHE_VERSION = 'ai-interior-v1.0.0';
const CACHE_NAME = `${CACHE_VERSION}::static`;
const RUNTIME_CACHE = `${CACHE_VERSION}::runtime`;

// Assets to cache on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/assets/css/main.css',
    '/assets/css/components.css',
    '/assets/js/main.js',
    '/assets/js/theme.js',
    '/assets/js/navigation.js',
    '/assets/js/animations.js',
    '/assets/js/portfolio.js',
    '/assets/js/utils.js',
    '/assets/js/form-handler.js',
    '/components/header.html',
    '/components/hero-section.html',
    '/components/about-section.html',
    '/components/services-section.html',
    '/components/portfolio-section.html',
    '/components/why-choose-section.html',
    '/components/process-section.html',
    '/components/testimonials-section.html',
    '/components/blog-section.html',
    '/components/contact-section.html',
    '/components/footer.html'
];

// CDN and external resources to cache at runtime
const RUNTIME_CACHE_URLS = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdnjs.cloudflare.com'
];

/**
 * Install Event - Cache static assets
 */
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Precaching static assets');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => {
                console.log('[SW] Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Installation failed:', error);
            })
    );
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Delete old caches
                        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Activation complete');
                return self.clients.claim();
            })
    );
});

/**
 * Fetch Event - Serve from cache or network
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        // Cache external resources (fonts, CDN)
        if (shouldCacheExternal(url)) {
            event.respondWith(cacheFirst(request, RUNTIME_CACHE));
        }
        return;
    }

    // Handle API requests differently
    if (request.url.includes('/api/')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Handle form submissions
    if (request.method !== 'GET') {
        event.respondWith(fetch(request));
        return;
    }

    // For navigation requests, use network first
    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request));
        return;
    }

    // For assets, use cache first
    event.respondWith(cacheFirst(request, CACHE_NAME));
});

/**
 * Cache First Strategy
 * Try cache first, fall back to network
 */
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);

        if (response.ok) {
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.error('[SW] Fetch failed:', error);

        // Return offline page if available
        const offlinePage = await cache.match('/offline.html');
        if (offlinePage) {
            return offlinePage;
        }

        // Return generic offline response
        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        });
    }
}

/**
 * Network First Strategy
 * Try network first, fall back to cache
 */
async function networkFirst(request) {
    const cache = await caches.open(RUNTIME_CACHE);

    try {
        const response = await fetch(request);

        if (response.ok) {
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.error('[SW] Network first failed, trying cache:', error);

        const cached = await cache.match(request);

        if (cached) {
            return cached;
        }

        // Return offline page for navigation
        if (request.mode === 'navigate') {
            const offlinePage = await caches.match('/offline.html') ||
                              await caches.match('/index.html');
            if (offlinePage) {
                return offlinePage;
            }
        }

        return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

/**
 * Check if external URL should be cached
 */
function shouldCacheExternal(url) {
    return RUNTIME_CACHE_URLS.some((cacheUrl) => url.href.startsWith(cacheUrl));
}

/**
 * Handle messages from clients
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }

    if (event.data && event.data.type === 'CACHE_URLS') {
        const urlsToCache = event.data.urls || [];
        event.waitUntil(
            caches.open(RUNTIME_CACHE).then((cache) => {
                return cache.addAll(urlsToCache);
            })
        );
    }
});

/**
 * Background Sync for offline form submissions
 */
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-forms') {
        event.waitUntil(syncForms());
    }
});

/**
 * Sync offline form submissions when back online
 */
async function syncForms() {
    // This would sync any queued form submissions
    // Implementation depends on your backend
    console.log('[SW] Syncing offline form submissions');
}

/**
 * Push notification handler (optional for future use)
 */
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};

    const options = {
        body: data.body || 'New update from AI Interior',
        icon: '/assets/images/icon-192.png',
        badge: '/assets/images/badge-72.png',
        data: data.url || '/'
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'AI Interior', options)
    );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data || '/')
    );
});

console.log('[SW] Service Worker script loaded');
