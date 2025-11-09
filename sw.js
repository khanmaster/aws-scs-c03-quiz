const CACHE_NAME = 'aws-scs-quiz-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/quiz.html',
  '/results.html',
  '/css/styles.css',
  '/js/quiz-config.js',
  '/js/question-loader.js',
  '/js/quiz-engine.js',
  '/js/timer.js',
  '/js/progress.js',
  '/js/results.js',
  '/js/utils.js',
  '/data/questions.json',
  '/data/config.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(error => {
        console.error('Failed to cache resources during install:', error);
        throw error;
      })
  );
});

self.addEventListener('fetch', event => {
  // Only handle GET requests from same origin to prevent CSRF
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(error => {
          console.error('Fetch failed:', error);
          throw error;
        });
      })
      .catch(error => {
        console.error('Cache match failed:', error);
        return fetch(event.request);
      })
  );
});