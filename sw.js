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
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});