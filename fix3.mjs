import { writeFileSync } from 'fs';

const sw = `const CACHE_NAME = 'boxflow-os-v1';
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/assets/logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  self.registration.showNotification(data.title || 'BoxFlow OS', {
    body: data.body || 'New update from BoxFlow OS',
    icon: '/assets/logo.png',
    badge: '/assets/logo.png',
    vibrate: [200, 100, 200],
  });
});`;

writeFileSync('public/sw.js', sw, 'utf8');
console.log('Service worker created!');

// Register service worker in layout
import { readFileSync } from 'fs';
let layout = readFileSync('app/layout.tsx', 'utf8');
if (!layout.includes('serviceWorker')) {
  layout = layout.replace(
    '<body style={{ margin: 0, padding: 0, background: \'#020617\' }}>',
    `<body style={{ margin: 0, padding: 0, background: '#020617' }}>
        <script dangerouslySetInnerHTML={{ __html: \`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js')
                .then(function(reg) { console.log('SW registered'); })
                .catch(function(err) { console.log('SW error:', err); });
            });
          }
        \`}} />`
  );
  writeFileSync('app/layout.tsx', layout, 'utf8');
  console.log('Service worker registered in layout!');
} else {
  console.log('Service worker already registered!');
}