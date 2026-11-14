// オフラインでも開けるようにするための仕組み（Service Worker）
// アプリの一覧(APPS)は apps.js から読む。アプリのアイコンはそこから自動で並べる
importScripts("apps.js");
const CACHE_NAME = "launcher-v5";
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

// 控え（キャッシュ）を探す。URLの「?」より後ろは見ない。画面の控えが無ければトップ画面を出す
function fromCache(request) {
  return caches.match(request, { ignoreSearch: true })
    .then((hit) => hit || (request.mode === "navigate" ? caches.match("./index.html") : undefined));
}

// ネット優先: まず最新を取りに行く。3秒たっても返事がない（電波が弱い）ときや、失敗したときは控えを使う
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return; // 送信などはふつうに通す
  const network = fetch(event.request);

  // 成功した返事（200番台）だけ保存する。404やエラーで正しい控えを上書きしないため
  event.waitUntil(
    network.then((response) => {
      if (response.ok) {
        const clone = response.clone();
        return caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
      }
    }).catch(() => {})
  );

  // 3秒のタイマー。鳴ったら控えを出す（控えが無ければそのままネットを待つ）
  const timeout = new Promise((resolve) => setTimeout(resolve, 3000))
    .then(() => fromCache(event.request))
    .then((hit) => hit || network);

  // Promise.race ＝ 先に終わったほうを使う
  event.respondWith(
    Promise.race([network, timeout])
      .catch(() => fromCache(event.request).then((hit) => hit || Response.error()))
  );
});
