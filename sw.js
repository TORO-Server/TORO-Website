"use strict";
(() => {
  // src/sw.ts
  var CACHE = "toro-website-v1";
  var OFFLINE_URL = "/offline.html";
  var SHELL = [
    "/",
    OFFLINE_URL,
    "/logo.svg",
    "/manifest.webmanifest",
    "/apple-touch-icon.png",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/icons/icon-maskable-512.png"
  ];
  self.addEventListener("install", (event) => {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE);
        await cache.addAll(SHELL.map((url) => new Request(url, { cache: "reload" })));
        await self.skipWaiting();
      })()
    );
  });
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      (async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
        await self.clients.claim();
      })()
    );
  });
  self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;
    if (request.mode === "navigate") {
      event.respondWith(networkFirst(request));
    } else {
      event.respondWith(staleWhileRevalidate(request, event));
    }
  });
  function cacheable(response) {
    return response.ok && response.type === "basic";
  }
  async function networkFirst(request) {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request);
      if (cacheable(response)) await cache.put(request, response.clone());
      return response;
    } catch {
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;
      const offline = await cache.match(OFFLINE_URL);
      return offline ?? new Response("オフラインです", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
  }
  async function staleWhileRevalidate(request, event) {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    const update = fetch(request).then(async (response) => {
      if (cacheable(response)) await cache.put(request, response.clone());
      return response;
    });
    if (cached) {
      event.waitUntil(update.catch(() => void 0));
      return cached;
    }
    return update;
  }
})();
