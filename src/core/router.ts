import { useSyncExternalStore } from 'react'

/**
 * 해시 라우터 (#/w/catholic/gothic). 정적 호스팅(Cloudflare Pages)에서
 * 서버 설정 없이 동작하고 라이브러리가 필요 없다.
 */
function parse(): string[] {
  return location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent)
}

let route = parse()
const subs = new Set<() => void>()
window.addEventListener('hashchange', () => {
  route = parse()
  subs.forEach((f) => f())
  window.scrollTo(0, 0)
})

export function useRoute() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f)
      return () => subs.delete(f)
    },
    () => route,
  )
}

export function go(path: string) {
  location.hash = '/' + path.replace(/^\//, '')
}

export function href(path: string) {
  return '#/' + path.replace(/^\//, '')
}
