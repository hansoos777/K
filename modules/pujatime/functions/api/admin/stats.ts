import { kstDay, type Env } from '../../_stats'

const LOCK_MS = 15 * 60e3
const MAX_FAILS = 5

const sha = (s: string) => crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('')

// 글자 하나씩 비교하면 응답 시간으로 추측될 수 있어 해시를 일정한 시간에 비교
async function sameKey(given: string, real?: string) {
  if (!real || !given || given.length > 200) return false
  const [a, b] = await Promise.all([sha(given), sha(real)])
  return (crypto.subtle as unknown as { timingSafeEqual: (x: ArrayBuffer, y: ArrayBuffer) => boolean }).timingSafeEqual(a, b)
}

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

// 관리자 통계. 비밀번호는 주소에 남지 않게 본문으로 받고, 같은 곳에서 5번 틀리면 15분 막음.
export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const ip = hex(await sha(request.headers.get('CF-Connecting-IP') ?? 'unknown'))
  const now = Date.now()
  const row = (await env.DB.prepare('SELECT n, until FROM admin_fails WHERE ip_hash = ?').bind(ip).all()).results[0]
  if (row && row.n >= MAX_FAILS && row.until > now) return json({ error: 'locked' }, 429)

  if (!(await sameKey(await request.text(), env.ADMIN_KEY))) {
    const n = row && row.until > now ? row.n + 1 : 1
    await env.DB.prepare('INSERT OR REPLACE INTO admin_fails(ip_hash, n, until) VALUES (?, ?, ?)').bind(ip, n, now + LOCK_MS).run()
    return json({ error: 'forbidden' }, 403)
  }
  if (row) await env.DB.prepare('DELETE FROM admin_fails WHERE ip_hash = ?').bind(ip).run()

  const since = kstDay(now - 13 * 86400e3)
  const all = async (sql: string, ...v: unknown[]) => {
    const q = env.DB.prepare(sql)
    return (await (v.length ? q.bind(...v) : q).all()).results
  }
  const group = (col: string) => all(`SELECT ${col} AS k, COUNT(*) AS n FROM devices WHERE ${col} IS NOT NULL GROUP BY ${col} ORDER BY n DESC LIMIT 20`)
  const [active, total, days, counters, joined, deities, langs, countries, feedback] = await Promise.all([
    all('SELECT COUNT(*) AS n FROM devices WHERE last_at > ?', now - 5 * 60e3),
    all('SELECT COUNT(*) AS n FROM devices'),
    all(
      `SELECT v.day, COUNT(*) AS visitors, SUM(d.first_day < v.day) AS again, SUM(d.first_day = v.day) AS fresh
       FROM visits v JOIN devices d ON d.id = v.device WHERE v.day >= ? GROUP BY v.day`,
      since,
    ),
    all('SELECT day, key, n FROM counters WHERE day >= ?', since),
    all(
      `SELECT d.first_day AS day, COUNT(*) AS joined,
       SUM(EXISTS(SELECT 1 FROM visits v WHERE v.device = d.id AND v.day = date(d.first_day, '+1 day'))) AS back
       FROM devices d WHERE d.first_day >= ? GROUP BY d.first_day`,
      since,
    ),
    group('deity'),
    group('lang'),
    group('country'),
    all('SELECT id, at, text, contact, lang FROM feedback ORDER BY at DESC LIMIT 50'),
  ])
  return json({ now: active[0].n, total: total[0].n, days, counters, joined, deities, langs, countries, feedback })
}
