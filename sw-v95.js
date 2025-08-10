const CACHE_NAME = "dlu-cache-v95-static-avatars-lite-sfx";
const CORE_ASSETS = [
  "./","./index.html","./manifest.json",
  "./icon-192.png","./icon-512.png",
  "./click.wav","./success.wav","./fail.wav",
  "./avatars/port1.png","./avatars/port10.png","./avatars/port11.png","./avatars/port12.png","./avatars/port13.png","./avatars/port14.png","./avatars/port15.png","./avatars/port16.png","./avatars/port2.png","./avatars/port3.png","./avatars/port4.png","./avatars/port5.png","./avatars/port6.png","./avatars/port7.png","./avatars/port8.png","./avatars/port9.png"
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    ).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isIndex = url.pathname.endsWith('/') || url.pathname.endsWith('/index.html') || url.pathname.endsWith('index.html');
  event.respondWith(
    fetch(event.request)
      .then((res) => { const clone = res.clone(); caches.open(CACHE_NAME).then((c)=>c.put(event.request, clone)); return res; })
      .catch(() => caches.match(event.request).then((cached) => cached || (isIndex ? caches.match("./index.html") : null)))
  );
});