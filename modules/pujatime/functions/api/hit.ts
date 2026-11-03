import { EVENTS, kstDay, type Env } from '../_stats'

const LANGS = ['ko', 'en', 'hi']

// 앱이 보내는 익명 사용 기록. 스프링이었다면 @PostMapping("/api/hit")에 해당.
export const onRequestPost = async ({ request, env }: { request: Request & { cf?: { country?: string } }; env: Env }) => {
  const raw = await request.text()
  if (raw.length > 300) return new Response(null, { status: 413 })
  let b: { d?: unknown; e?: unknown; s?: unknown; l?: unknown; g?: unknown }
  try {
    b = JSON.parse(raw)
  } catch {
    return new Response(null, { status: 400 })
  }
  const device = typeof b.d === 'string' && /^[0-9a-f-]{36}$/.test(b.d) ? b.d : null
  const event = EVENTS.find((x) => x === b.e)
  if (!device || !event) return new Response(null, { status: 400 })

  const day = kstDay()
  const stay = typeof b.s === 'number' && b.s > 0 ? Math.min(Math.round(b.s), 600) : 0
  const lang = LANGS.find((x) => x === b.l) ?? null
  const deity = typeof b.g === 'string' && /^[a-z]{2,12}$/.test(b.g) ? b.g : null
  const country = request.cf?.country ?? null
  const count = (key: string, n: number) =>
    env.DB.prepare('INSERT INTO counters(day, key, n) VALUES (?, ?, ?) ON CONFLICT(day, key) DO UPDATE SET n = n + excluded.n').bind(day, key, n)

  const list = [
    env.DB.prepare(
      `INSERT INTO devices(id, first_day, last_at, country, lang, deity) VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET last_at = excluded.last_at, country = COALESCE(excluded.country, country),
       lang = COALESCE(excluded.lang, lang), deity = COALESCE(excluded.deity, deity)`,
    ).bind(device, day, Date.now(), country, lang, deity),
    env.DB.prepare('INSERT OR IGNORE INTO visits(day, device) VALUES (?, ?)').bind(day, device),
  ]
  if (event !== 'ping') list.push(count(event, 1))
  if (stay) list.push(count('stay', stay))
  await env.DB.batch(list)
  return new Response(null, { status: 204 })
}
