// 오프라인용 서비스 워커: 게임 파일은 미리 담아 두고, 글꼴은 처음 받을 때 담아 둔다.
// 진짜 사이트(/K/)와 개발 사이트(/K/dev/)가 서로의 저장소를 지우지 않게 이름에 범위를 붙인다
const SCOPE = self.registration.scope
const VERSION = 'bugsmash-v3@' + SCOPE
const SHELL = [
  './', './index.html', './style.css', './manifest.webmanifest',
  './js/main.js', './js/state.js', './js/util.js', './js/audio.js', './js/fx.js', './js/art.js',
  './js/bugs.js', './js/gear.js', './js/weapons.js', './js/bg.js', './js/ui.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png',
]
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()))
})
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION && (k.endsWith('@' + SCOPE) || !k.includes('@'))).map((k) => caches.delete(k)))).then(() => self.clients.claim()))
})
self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  const font = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com'
  if (url.origin !== location.origin && !font) return
  // 같은 출처: 네트워크 먼저(새 버전 반영), 안 되면 담아 둔 것. 글꼴: 담아 둔 것 먼저.
  if (font) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res
    })))
    return
  }
  e.respondWith(fetch(req).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)) }
    return res
  }).catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html'))))
})
