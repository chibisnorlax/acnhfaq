let cacheName = "acnhfaq";

let filesToCache = [
  "/acnhfaq/",
  "/acnhfaq/service-worker.js",
  "/acnhfaq/assets/js/just-the-docs.js",
  "/acnhfaq/assets/js/vendor/lunr.min.js",
  "/acnhfaq/assets/fonts/font.css",
  "/acnhfaq/assets/css/just-the-docs-custom.css",
  "/acnhfaq/assets/logo.png",
  "/acnhfaq/manifest.json"
];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(cacheName).then((cache) => {
    console.log('installed successfully')
    return cache.addAll(filesToCache);
  }));
});

self.addEventListener('fetch', function (event) {

  if (event.request.url.includes('clean-cache')) {
    caches.delete(cacheName);
    console.log('Cache cleared')
  }

  event.respondWith(caches.match(event.request).then(function (response) {
    if (response) {
      console.log('served form cache')
    } else {
      console.log('Not serving from cache ', event.request.url)
    }
    return response || fetch(event.request);
  })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('service worker: Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});