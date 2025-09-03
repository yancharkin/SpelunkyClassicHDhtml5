const cacheName = 'SPLCACHE-v1.2.2';

self.addEventListener("install", (event) => {
    console.log("[Service Worker] Install");
    event.waitUntil(
        (async () => {
            const cache = await caches.open(cacheName);
            console.log("[Service Worker] Caching everything");
            try {
                await cache.addAll(filesList);
            } catch (error) {
                console.error(`[Service Worker] ${error}`);
                for (let f of filesList) {
                    try {
                        //console.log(`[Service Worker] Caching ${f}`);
                        await cache.add(f);
                    } catch (error) {
                        console.error(`[Service Worker] ${error}:`, f);
                    }
                }
            }
        })(),
    );
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key === cacheName) {
                        return;
                    }
                    console.warn(`[Service Worker] Cache removed: ${key}`);
                    return caches.delete(key);
                }),
            );
        }),
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        (async () => {
            const cachedResponse = await caches.match(event.request,{ignoreMethod:true});
            if (cachedResponse) {
                console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
                return cachedResponse;
            }
            try {
                const networkResponse = await fetch(event.request);
                if (networkResponse.ok) {
                    const cache = await caches.open(cacheName);
                    console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
                    cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
            } catch (error) {
                console.error(`[Service Worker] ${error}`, event.request.url);
                return Response.error();
            }
        })(),
    );
});

const filesList = [
    "/SpelunkyClassicHDhtml5/",
    "/SpelunkyClassicHDhtml5/favicon.ico",
    "/SpelunkyClassicHDhtml5/style.css",
    "/SpelunkyClassicHDhtml5/index.html",
    "/SpelunkyClassicHDhtml5/game.unx",
    "/SpelunkyClassicHDhtml5/runner.js",
    "/SpelunkyClassicHDhtml5/setup.js",
    "/SpelunkyClassicHDhtml5/runner.data",
    "/SpelunkyClassicHDhtml5/runner.wasm",
    "/SpelunkyClassicHDhtml5/assets/icons/icon-192.png",
    "/SpelunkyClassicHDhtml5/assets/icons/icon-512.png",
    "/SpelunkyClassicHDhtml5/assets/icons/icon-64.png"
];
