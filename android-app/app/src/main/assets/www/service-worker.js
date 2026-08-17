const CACHE_NAME = "psyetica-static-v1.0.0";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./app.js",
  "./styles.css",
  "./manifest.webmanifest",
  "./icons/favicon-32.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./fonts/noto_sans_arabic.ttf",
  "./fonts/source_sans_3.ttf",
  "./data/articles.it.json",
  "./data/cases.it.json",
  "./data/cross_references.it.json",
  "./data/glossary.it.json",
  "./data/editorial/articles.01-08.it.json",
  "./data/editorial/articles.09-17.it.json",
  "./data/editorial/articles.18-27.it.json",
  "./data/editorial/articles.28-37.it.json",
  "./data/editorial/articles.38-42.it.json",
  "./data/i18n/languages.json",
  "./data/i18n/terminology-sources.json",
  "./data/i18n/ar/articles.ar.json",
  "./data/i18n/ar/cases.ar.json",
  "./data/i18n/ar/glossary.ar.json",
  "./data/i18n/en/articles.en.json",
  "./data/i18n/en/cases.en.json",
  "./data/i18n/en/glossary.en.json",
  "./data/i18n/es/articles.es.json",
  "./data/i18n/es/cases.es.json",
  "./data/i18n/es/glossary.es.json",
  "./data/i18n/fa/articles.fa.json",
  "./data/i18n/fa/cases.fa.json",
  "./data/i18n/fa/glossary.fa.json",
  "./data/i18n/ro/articles.ro.json",
  "./data/i18n/ro/cases.ro.json",
  "./data/i18n/ro/glossary.ro.json",
  "./data/i18n/sq/articles.sq.json",
  "./data/i18n/sq/cases.sq.json",
  "./data/i18n/sq/glossary.sq.json"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(cached => {
      const network = fetch(event.request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)));
        }
        return response;
      });
      if (cached) {
        event.waitUntil(network.catch(() => undefined));
        return cached;
      }
      return network.catch(() => event.request.mode === "navigate" ? caches.match("./index.html") : Response.error());
    })
  );
});
