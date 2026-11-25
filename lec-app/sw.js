/* Showcase copy: no offline caching here, so the demo loads fast and nothing big downloads in the background. */
self.addEventListener('install',function(){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(self.registration.unregister().then(function(){return caches.keys()}).then(function(k){return Promise.all(k.map(function(n){return caches.delete(n)}))}))});
