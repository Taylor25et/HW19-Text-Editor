const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
// Set up asset cache
registerRoute(
  // Here we define the callback function that will filter the requests we want to cache (in this case, JS and CSS files)
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    // Name of the cache storage.
    cacheName: 'jate-image-cache',
    plugins: [
      // This plugin will cache responses with these headers to a maximum-age of 30 days
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      })
    ],
  })
);
registerRoute();
