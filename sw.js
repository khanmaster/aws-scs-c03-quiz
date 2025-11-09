const CACHE_NAME = 'aws-scs-quiz-v2';
const urlsToCache = [
  '/aws-scs-c03-quiz/',
  '/aws-scs-c03-quiz/index.html',
  '/aws-scs-c03-quiz/quiz.html',
  '/aws-scs-c03-quiz/results.html',
  '/aws-scs-c03-quiz/css/styles.css',
  '/aws-scs-c03-quiz/js/quiz-config.js',
  '/aws-scs-c03-quiz/js/question-loader.js',
  '/aws-scs-c03-quiz/js/quiz-engine.js',
  '/aws-scs-c03-quiz/js/timer.js',
  '/aws-scs-c03-quiz/js/progress.js',
  '/aws-scs-c03-quiz/js/results.js',
  '/aws-scs-c03-quiz/js/utils.js',
  '/aws-scs-c03-quiz/data/questions.json',
  '/aws-scs-c03-quiz/data/config.json'
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