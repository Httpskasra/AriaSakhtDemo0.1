/*
 * Tejaris service worker.
 *
 * Only public shell/static assets are cached. API, auth, payment, dashboard,
 * and uploaded user data intentionally remain network-only.
 */
const VERSION = 'tejaris-pwa-v2';
const STATIC_CACHE = `${VERSION}-static`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const OFFLINE_URL = '/offline.html';
const PRECACHE_URLS = [
  '/',
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png'
];

function isExcludedPath(pathname) {
  return ['/sw.js', '/api', '/auth', '/dashboard', '/payment', '/uploads']
    .some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isStaticAsset(request, pathname) {
  return pathname.startsWith('/_nuxt/')
    || pathname.startsWith('/icons/')
    || request.destination === 'script'
    || request.destination === 'style'
    || request.destination === 'font'
    || request.destination === 'image'
    || /\.(?:css|js|mjs|woff2?|ttf|eot|png|jpe?g|webp|gif|svg|ico|webmanifest)$/.test(pathname);
}

async function cachePrecacheUrls() {
  const cache = await caches.open(STATIC_CACHE);
  await Promise.all(PRECACHE_URLS.map(async (url) => {
    try {
      const response = await fetch(new Request(url, { cache: 'reload' }));
      if (response.ok) await cache.put(url, response);
    } catch {
      // A failed optional precache must not prevent the worker from installing.
    }
  }));
}

async function networkFirstNavigation(request) {
  const pathname = new URL(request.url).pathname;

  try {
    const response = await fetch(request);

    // Keep only the public landing page as a navigation fallback. This avoids
    // persisting personalized SSR responses in an offline cache.
    if (response.ok && pathname === '/') {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put('/', response.clone());
    }

    return response;
  } catch {
    const staticCache = await caches.open(STATIC_CACHE);

    // The public landing page can be shown offline. Other routes must not
    // receive an unrelated SSR response (especially private dashboard pages).
    if (pathname === '/') {
      const runtimeCache = await caches.open(RUNTIME_CACHE);
      return (await runtimeCache.match('/'))
        || (await staticCache.match('/'))
        || (await staticCache.match(OFFLINE_URL));
    }

    return staticCache.match(OFFLINE_URL);
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('install', (event) => {
  event.waitUntil(cachePrecacheUrls().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
        .map((key) => caches.delete(key))
    )),
    self.clients.claim()
  ]));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isExcludedPath(url.pathname)) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (isStaticAsset(request, url.pathname)) {
    event.respondWith(cacheFirst(request));
  }
});
