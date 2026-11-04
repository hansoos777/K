// 흰 배경을 지워 투명 PNG로 (PujaTime scripts/murti/cutout.mjs 와 같은 방식)
// 사용: node scripts/statues/cutout.mjs            → source/*.webp 를 모두 public/statues/<id>.png 로
import { createRequire } from 'module'
import { mkdirSync, readdirSync } from 'fs'
const require = createRequire(new URL('../../modules/pujatime/package.json', import.meta.url))
const sharp = require('sharp')
const src = new URL('./source/', import.meta.url)
mkdirSync(new URL('../../public/statues/', import.meta.url), { recursive: true })
for (const f of readdirSync(src).filter((f) => f.endsWith('.webp'))) {
  const id = f.replace('.webp', '')
  const out = new URL(`../../public/statues/${id}.png`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
  const { data, info } = await sharp(new URL(f, src).pathname.replace(/^\/([A-Za-z]:)/, '$1')).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H } = info
  // 네 모서리 평균 색을 배경색으로 보고, 그 색과 가까운 픽셀만 지움 (흰 배경·초록 배경 모두)
  const corner = [0, W - 1, (H - 1) * W, H * W - 1].map((k) => k * 4)
  const bg = [0, 1, 2].map((c) => corner.reduce((s, i) => s + data[i + c], 0) / 4)
  const white = Math.min(...bg) > 200
  const isBg = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    if (white) return Math.min(r, g, b) > 150 && Math.max(r, g, b) - Math.min(r, g, b) < 26
    return Math.hypot(r - bg[0], g - bg[1], b - bg[2]) < 45
  }
  const seen = new Uint8Array(W * H); const stack = []
  const push = (x, y) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const k = y * W + x; if (seen[k] || !isBg(k * 4)) return; seen[k] = 1; stack.push(k) }
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1) }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y) }
  while (stack.length) { const k = stack.pop(); const x = k % W, y = (k / W) | 0; push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1) }
  for (let k = 0; k < W * H; k++) if (seen[k]) data[k * 4 + 3] = 0
  const mask = await sharp(data, { raw: info }).extractChannel(3).blur(0.8).raw().toBuffer()
  for (let k = 0; k < W * H; k++) data[k * 4 + 3] = mask[k]
  await sharp(data, { raw: info }).trim({ threshold: 2 }).png({ compressionLevel: 9 }).toFile(out)
  // 확인용: 어두운 배경에 올린 미리보기 (source/ 는 커밋 안 됨)
  await sharp(out).flatten({ background: '#2a1f3d' }).jpeg().toFile(new URL(`${id}-check.jpg`, src).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
  console.log(id, '→', out)
}
