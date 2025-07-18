// Service Worker for Corda Vertical Traveler Timesheet PWA
const CACHE_NAME = 'cvt-timesheet-v1.0.0';
const DATA_CACHE_NAME = 'cvt-timesheet-data-v1.0.0';

// Files to cache for offline functionality
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg'
];

// Install event - cache initial files
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(FILES_TO_CACHE);
      })
      .catch((error) => {
        console.error('[ServiceWorker] Pre-caching failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  console.log('[ServiceWorker] Fetch', event.request.url);
  
  // Handle API requests separately
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            // If the request was successful, clone the response and store it in the cache
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          })
          .catch(() => {
            // If the fetch fails (offline), try to get the data from cache
            return cache.match(event.request).then((cachedResponse) => {
              return cachedResponse || new Response('{"error": "API not available offline"}', { 
                status: 503, 
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
              });
            });
          });
      })
    );
    return;
  }

  // Handle all other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).catch(() => {
          // If both cache and network fail, return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html').then((indexResponse) => {
              return indexResponse || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
            });
          }
          // For non-navigation requests, return a basic error response
          return new Response('Resource not available offline', { status: 503, statusText: 'Service Unavailable' });
        });
      })
  );
});

// Background sync for when connectivity is restored
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync', event.tag);
  
  if (event.tag === 'timesheet-sync') {
    event.waitUntil(
      // Sync any pending timesheet data when back online
      syncTimesheetData()
    );
  }
});

// Push notification handling (for future use)
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push Received.');
  
  const options = {
    body: 'Timesheet reminder or update',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('CVT Timesheet', options)
  );
});

// Function to sync timesheet data (placeholder for future implementation)
async function syncTimesheetData() {
  try {
    // This would sync any locally stored timesheet data with server
    console.log('[ServiceWorker] Syncing timesheet data...');
    // Implementation would go here
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
  }
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification click Received.');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});