// オフラインでも開けるようにするための仕組み（Service Worker）
// アプリの一覧(APPS)は apps.js から読む。アプリのアイコンはそこから自動で並べる
importScripts("apps.js");
const CACHE_NAME = "launcher-v4";
const CACHE_FILES = [
  "./", "./index.html", "./apps.js", "./manifest.json",
  "./icons/launcher.svg", "./icons/launcher-192.png", "./icons/launcher-512.png", "./icons/apple-touch-icon.png",
  ...APPS.map((a) => "./" + a.icon),
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_FILES)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("launcher-") && key !== CACHE_NAME) /* 同じ住所のほかのアプリのキャッシュは消さない */.map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// ネット優先: まず最新を取りに行き、失敗した時だけキャッシュ(オフライン用)を使う
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 成功した返事（200番台）だけ保存する。404やエラーで正しいキャッシュを上書きしないため
        if (response.ok && event.request.method === "GET") {
          const clone = response.clone();
          event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
