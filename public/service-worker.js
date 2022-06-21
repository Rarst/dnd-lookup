/* global importScripts,self,workbox */

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.3/workbox-sw.js"
);

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

workbox.routing.registerRoute(
  new RegExp(".+5e-SRD.+json"),
  new workbox.strategies.CacheFirst({
    cacheName: "5e-srd",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 86400,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  new RegExp(".*cdn.jsdelivr.*"),
  new workbox.strategies.CacheFirst({
    cacheName: "cdn-jsdelivr",
  })
);

workbox.routing.registerRoute(
  new RegExp(".*fonts.bunny.*"),
  new workbox.strategies.NetworkFirst({
    cacheName: "fonts-bunny",
  })
);

workbox.routing.registerRoute(
  new RegExp("/assets/.*"),
  new workbox.strategies.NetworkFirst()
);
