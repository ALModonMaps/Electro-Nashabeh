const CACHE='nsh-admin-5-6';
const CORE=['./manifest.json?v=53','./icons/apple-touch-icon.png?v=53','./icons/icon-192.png?v=53','./icons/icon-512.png?v=53'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)))})
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())))
self.addEventListener('fetch',e=>{if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(()=>caches.match('./index.html')));return}e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))})
