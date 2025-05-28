// Service Worker for offline capability
const CACHE_NAME = 'dual-index-calculator-v9';

// Files to cache for offline use
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/styles.css',
  '/styles-dropdown.css',
  '/styles-radio.css',
  '/styles-reagent.css',
  '/mobile-responsive.css',
  '/animations.css',
  '/analytical-animations.css',
  '/web-renderer.js',
  '/main.js',
  '/preload.js',
  '/renderer.js',
  '/manifest.json',
  '/generated-icon.png',
  '/vendors/bootstrap.min.css',
  '/vendors/chart.min.js',
  '/vendors/chartjs-plugin-annotation.min.js',
  '/vendors/feather.min.js',
  '/vendors/jspdf.umd.min.js',
  '/vendors/exceljs.min.js',
  // Add paths to all your src files
  '/src/components/App.js',
  '/src/components/Header.js',
  '/src/components/Footer.js',
  '/src/components/Results.js',
  '/src/components/Visualization.js',
  '/src/components/SavedCalculations.js',
  '/src/components/LanguageSelector.js',
  '/src/components/visualizations/DualColumnHistogram.js',
  '/src/components/visualizations/RadarChart.js',
  '/src/components/forms/SamplePreparationForm.js',
  '/src/components/forms/InstrumentationForm.js',
  '/src/components/forms/ReagentForm.js',
  '/src/components/forms/WasteForm.js',
  '/src/components/forms/PracticalityForm.js',
  '/src/utils/animations.js',
  '/src/utils/analytical-animations.js',
  '/src/utils/calculations.js',
  '/src/utils/database.js',
  '/src/utils/excel.js',
  '/src/utils/i18n.js',
  '/src/utils/pdf.js',
  '/src/data/constants.js',
  '/src/data/locales/en.js',
  '/src/data/locales/es.js',
  '/src/data/locales/zh.js',
  '/src/data/templates.js'
];

// Install event - cache all required files
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  
  // Ensure the service worker takes control of all pages immediately
  return self.clients.claim();
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', (event) => {
  console.log('[ServiceWorker] Fetch', event.request.url);
  
  // Skip caching for WasteForm.js and calculations.js files to always get the latest version
  if (event.request.url.includes('WasteForm.js') || 
      event.request.url.includes('calculations.js')) {
    console.log('[ServiceWorker] Bypassing cache for:', event.request.url);
    event.respondWith(fetch(event.request));
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the cached response
        if (response) {
          console.log('[ServiceWorker] Serving from cache:', event.request.url);
          return response;
        }
        
        // If not in cache, fetch from network
        console.log('[ServiceWorker] Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              console.log('[ServiceWorker] Invalid response from network');
              return response;
            }
            
            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();
            
            // Add the response to cache for future offline access
            caches.open(CACHE_NAME)
              .then((cache) => {
                console.log('[ServiceWorker] Caching new resource:', event.request.url);
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch((error) => {
            console.log('[ServiceWorker] Fetch failed; returning offline page instead.', error);
            
            // Check if the request is for an HTML page
            if (event.request.mode === 'navigate' || 
                (event.request.method === 'GET' && 
                 event.request.headers.get('accept').includes('text/html'))) {
              console.log('[ServiceWorker] Returning offline page');
              return caches.match('/offline.html');
            }
            
            // For API requests or other resources, return a default response
            return new Response(
              JSON.stringify({ 
                error: 'Network connection unavailable',
                offline: true,
                timestamp: new Date().toISOString()
              }),
              { 
                headers: { 'Content-Type': 'application/json' } 
              }
            );
          });
      })
  );
});