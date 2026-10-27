const CACHE='qingying-diary-v2.2.0';
const ASSETS=['./','./index.html','./manifest.json','./icon.svg','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('qingying-diary-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));}return res;}).catch(()=>caches.match('./index.html')));
  }else{
    event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return res;})));
  }
});