// ORUVIA 서비스 워커: 한 번 받은 파일은 기기에 두고 다시 받지 않는다(트래픽 절약, 오프라인 동작).
// - /assets/* : 파일 이름에 해시가 있어 내용이 안 바뀜 → 캐시 우선
// - 페이지(HTML): 네트워크 우선, 실패하면 캐시 (오프라인에서도 열림)
// - 다른 사이트 요청은 건드리지 않음
const CACHE = 'site-v2'
const SHELL = ['/', '/favicon.svg', '/manifest.webmanifest']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== location.origin) return

  // /hindu/ (PujaTime)은 PujaTime 쪽 캐시 규칙을 따르므로 건드리지 않음
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(
      caches.match(req).then((hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(req, copy))
          }
          return res
        }),
      ),
    )
    return
  }

  if (req.mode === 'navigate' && (url.pathname === '/' || url.pathname === '/index.html')) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put('/', copy))
          return res
        })
        .catch(() => caches.match('/')),
    )
  }
})
