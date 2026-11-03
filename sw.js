// オフラインでも開けるようにするための仕組み（Service Worker）
const CACHE_NAME = "launcher-v1";
const CACHE_FILES = [
  "./", "./index.html", "./manifest.json",
  "./icons/launcher.svg", "./icons/launcher-192.png", "./icons/launcher-512.png", "./icons/apple-touch-icon.png",
  "./icons/hq.png", "./icons/kissa.png", "./icons/recipe.png", "./icons/poikatsu.png", "./icons/chat.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_FILES)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// ネット優先: まず最新を取りに行き、失敗した時だけキャッシュ(オフライン用)を使う
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
