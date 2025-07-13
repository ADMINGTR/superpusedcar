/**
 * Service Worker for Super P Used Cars
 * Provides offline support, caching, and performance optimization
 */

const CACHE_NAME = 'super-p-used-cars-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/aboutus.html',
  '/youtubeg.html',
  '/css/main.css',
  '/js/main.js',
  '/images/map2.jpg',
  'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&family=Caveat:wght@400;600;700&family=Dancing+Script:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
