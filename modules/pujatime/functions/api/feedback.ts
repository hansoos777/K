import { type Env } from '../_stats'

const LIMIT = 5
const HOUR = 3600e3

const hash = async (s: string) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map((x) => x.toString(16).padStart(2, '0')).join('')

// 스프링이었다면 @PostMapping("/api/feedback")에 해당.
export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const raw = await request.text()
  if (raw.length > 4000) return new Response(null, { status: 413 })
  let b: { text?: unknown; contact?: unknown; lang?: unknown }
  try {
    b = JSON.parse(raw)
  } catch {
    return new Response(null, { status: 400 })
  }
  const text = typeof b.text === 'string' ? b.text.trim().slice(0, 1000) : ''
  const contact = typeof b.contact === 'string' ? b.contact.trim().slice(0, 100) : ''
  const lang = typeof b.lang === 'string' ? b.lang.slice(0, 5) : ''
  if (text.length < 2) return new Response(null, { status: 400 })

  const now = Date.now()
  const ip = await hash(request.headers.get('CF-Connecting-IP') ?? 'unknown')
  const recent = (await env.DB.prepare('SELECT COUNT(*) AS n FROM feedback WHERE ip_hash = ? AND at > ?').bind(ip, now - HOUR).all()).results[0].n
  if (recent >= LIMIT) return new Response(null, { status: 429 })

  await env.DB.prepare('INSERT INTO feedback(at, text, contact, lang, ip_hash) VALUES (?, ?, ?, ?, ?)').bind(now, text, contact, lang, ip).run()
  return new Response(null, { status: 204 })
}
