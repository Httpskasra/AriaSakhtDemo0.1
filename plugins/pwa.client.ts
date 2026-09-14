/**
 * Registers the production service worker and removes stale local-dev
 * registrations so a previous PWA build cannot interfere with Nuxt HMR.
 */
export default defineNuxtPlugin(() => {
  if (!('serviceWorker' in navigator)) return;

  const isTejarisWorker = (registration: ServiceWorkerRegistration) => {
    const worker = registration.active || registration.waiting || registration.installing;
    if (!worker) return false;

    try {
      return new URL(worker.scriptURL).pathname === '/sw.js';
    } catch {
      return false;
    }
  };

  const removeDevWorker = async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations
        .filter(isTejarisWorker)
        .map((registration) => registration.unregister())
    );
  };

  const registerWorker = async () => {
    if (import.meta.dev) {
      await removeDevWorker();
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      // Check for a newer worker after each production page load. The worker
      // itself uses skipWaiting/clients.claim, so the update applies safely.
      await registration.update();
    } catch (error) {
      // PWA support is an enhancement; an unavailable SW must not break the app.
      console.warn('[PWA] Service worker registration failed', error);
    }
  };

  if (document.readyState === 'complete') {
    void registerWorker();
  } else {
    window.addEventListener('load', () => void registerWorker(), { once: true });
  }
});
