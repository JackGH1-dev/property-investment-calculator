// 📱 InvestQuest Service Worker - PWA Offline Support
// Version 1.2.0

const CACHE_NAME = 'investquest-v1.2.0';
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/calculator.html',
  '/education.html',
  '/dashboard.html',
  '/styles.css',
  '/styles/mobile-enhancements.css',
  '/script.js',
  '/auth-production.js',
  '/global-auth-init.js',
  '/dashboard-production.js',
  '/performance-optimizer.js',
  '/manifest.json'
];

// Assets to cache on demand
const DYNAMIC_CACHE = 'investquest-dynamic-v1.2.0';

// Install event - cache core resources
self.addEventListener('install', (event) => {
  console.log('📱 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📱 Caching core assets');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => {
        console.log('📱 Service Worker installed successfully');
        return self.skipWaiting(); // Take control immediately
      })
      .catch((error) => {
        console.error('📱 Service Worker installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('📱 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
              console.log('📱 Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('📱 Service Worker activated');
        return self.clients.claim(); // Take control of all clients
      })
  );
});

// Fetch event - serve cached content when available
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Handle different types of requests
  event.respondWith(
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Cache First (for core assets)
    if (CACHE_ASSETS.includes(url.pathname)) {
      return await cacheFirst(request);
    }
    
    // Strategy 2: Network First (for API calls and dynamic content)
    if (url.pathname.startsWith('/api/') || url.pathname.includes('auth')) {
      return await networkFirst(request);
    }
    
    // Strategy 3: Stale While Revalidate (for other resources)
    return await staleWhileRevalidate(request);
    
  } catch (error) {
    console.error('📱 Fetch error:', error);
    
    // Return offline fallback
    return getOfflineFallback(request);
  }
}

// Cache First Strategy - for core assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('📱 Network failed, serving offline fallback');
    return getOfflineFallback(request);
  }
}

// Network First Strategy - for dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('📱 Network failed, checking cache');
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return getOfflineFallback(request);
  }
}

// Stale While Revalidate Strategy - for general resources
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  // Background fetch to update cache
  const fetchPromise = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => {
      console.log('📱 Background fetch failed');
    });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Otherwise wait for network
  try {
    return await fetchPromise;
  } catch (error) {
    return getOfflineFallback(request);
  }
}

// Offline fallback responses
function getOfflineFallback(request) {
  const url = new URL(request.url);
  const acceptHeader = request.headers.get('Accept') || '';
  
  // HTML fallback
  if (acceptHeader.includes('text/html')) {
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - InvestQuest</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
            text-align: center;
            background: #f8fafc;
          }
          .offline-container {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
          .offline-icon {
            font-size: 4rem;
            margin-bottom: 20px;
          }
          h1 {
            color: #111827;
            margin-bottom: 16px;
          }
          p {
            color: #6b7280;
            margin-bottom: 24px;
          }
          .btn {
            background: #3b82f6;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            display: inline-block;
            margin: 8px;
          }
          .features {
            text-align: left;
            margin-top: 30px;
            padding: 20px;
            background: #f3f4f6;
            border-radius: 8px;
          }
          .features h3 {
            color: #374151;
            margin-bottom: 12px;
          }
          .features ul {
            color: #6b7280;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="offline-container">
          <div class="offline-icon">📱</div>
          <h1>You're Offline</h1>
          <p>InvestQuest is running in offline mode. Some features may be limited, but you can still access cached content.</p>
          
          <div class="features">
            <h3>✓ Available Offline:</h3>
            <ul>
              <li>Previously loaded pages</li>
              <li>Property calculator (with limitations)</li>
              <li>Education content</li>
              <li>Saved calculations (locally stored)</li>
            </ul>
          </div>
          
          <br>
          <a href="/" class="btn">🏠 Home</a>
          <a href="/calculator.html" class="btn">🧮 Calculator</a>
          <button onclick="window.location.reload()" class="btn">🔄 Retry</button>
        </div>
        
        <script>
          // Retry connection every 30 seconds
          setInterval(() => {
            if (navigator.onLine) {
              window.location.reload();
            }
          }, 30000);
        </script>
      </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      }
    });
  }
  
  // JSON fallback for API requests
  if (acceptHeader.includes('application/json')) {
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'This feature requires an internet connection',
      offline: true
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  }
  
  // Generic fallback
  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'property-calculation') {
    event.waitUntil(syncPropertyCalculation());
  }
});

async function syncPropertyCalculation() {
  try {
    // Get pending calculations from IndexedDB
    const pendingCalculations = await getPendingCalculations();
    
    for (const calculation of pendingCalculations) {
      try {
        // Submit calculation when online
        const response = await fetch('/api/calculations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(calculation.data)
        });
        
        if (response.ok) {
          // Remove from pending queue
          await removePendingCalculation(calculation.id);
          console.log('📱 Synced calculation:', calculation.id);
        }
      } catch (error) {
        console.error('📱 Failed to sync calculation:', error);
      }
    }
  } catch (error) {
    console.error('📱 Background sync failed:', error);
  }
}

// IndexedDB operations for offline functionality
async function getPendingCalculations() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('InvestQuestOffline', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['calculations'], 'readonly');
      const store = transaction.objectStore('calculations');
      const getRequest = store.getAll();
      
      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore('calculations', { keyPath: 'id' });
    };
  });
}

async function removePendingCalculation(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('InvestQuestOffline', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['calculations'], 'readwrite');
      const store = transaction.objectStore('calculations');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Push notification support
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body || 'InvestQuest notification',
    icon: '/manifest-icon-192.png',
    badge: '/manifest-icon-192.png',
    tag: data.tag || 'general',
    data: data.url || '/',
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/manifest-icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'InvestQuest', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((clientList) => {
          // Check if app is already open
          for (const client of clientList) {
            if (client.url === url && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Open new window
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_SIZE':
      getCacheSize()
        .then(size => {
          event.ports[0].postMessage({
            type: 'CACHE_SIZE',
            size
          });
        });
      break;
      
    case 'CLEAR_CACHE':
      clearCache()
        .then(() => {
          event.ports[0].postMessage({
            type: 'CACHE_CLEARED'
          });
        });
      break;
  }
});

async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

async function clearCache() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
}

console.log('📱 InvestQuest Service Worker loaded successfully');