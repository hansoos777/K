/**
 * 외부 분석 서비스 없이 브라우저 API로만 성능을 잰다 (비용 0).
 * 설정 > 진단에서 볼 수 있다. 2단계에서 필요하면 표본만 서버로 보낸다.
 */
export interface Metric { key: string; value: number; unit: 'ms' | 'KB' }

const worldLoads: Record<string, number> = {}
const starts: Record<string, number> = {}
let lcp = 0

try {
  new PerformanceObserver((list) => {
    const last = list.getEntries().at(-1)
    if (last) lcp = last.startTime
  }).observe({ type: 'largest-contentful-paint', buffered: true })
} catch {
  /* 지원하지 않는 브라우저 */
}

export function markWorldStart(id: string) {
  starts[id] = performance.now()
}

export function markWorldReady(id: string) {
  if (starts[id] != null && worldLoads[id] == null) worldLoads[id] = performance.now() - starts[id]
}

export function collect(): Metric[] {
  const out: Metric[] = []
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  if (nav) {
    out.push({ key: 'ttfb', value: nav.responseStart, unit: 'ms' })
    out.push({ key: 'dcl', value: nav.domContentLoadedEventEnd, unit: 'ms' })
  }
  const fcp = performance.getEntriesByName('first-contentful-paint')[0]
  if (fcp) out.push({ key: 'fcp', value: fcp.startTime, unit: 'ms' })
  if (lcp) out.push({ key: 'lcp', value: lcp, unit: 'ms' })
  const res = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  const bytes = res.reduce((n, r) => n + (r.transferSize || 0), 0) + (nav?.transferSize ?? 0)
  out.push({ key: 'transfer', value: bytes / 1024, unit: 'KB' })
  for (const [id, ms] of Object.entries(worldLoads)) out.push({ key: 'world:' + id, value: ms, unit: 'ms' })
  return out
}
