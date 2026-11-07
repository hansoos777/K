// 게임 폴더(../bugsmash)를 토스용 dist/로 복사한다.
// - 서비스 워커(sw.js)·설치 안내는 빼고(토스가 앱을 관리), window.__TOSS__ = true 를 넣는다
// - 문서·배포 설정·도구는 넣지 않는다
import { cpSync, rmSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const src = join(here, '..', '..', 'bugsmash')
const out = join(here, '..', 'dist')
const SKIP = new Set(['README.md', '_headers', 'sw.js', 'tools'])

rmSync(out, { recursive: true, force: true })
cpSync(src, out, {
  recursive: true,
  filter: (p) => {
    const rel = relative(src, p)
    if (!rel) return true
    return !SKIP.has(rel.split(sep)[0])
  },
})

const html = join(out, 'index.html')
let s = readFileSync(html, 'utf8')
s = s.replace('<link rel="manifest" href="manifest.webmanifest" />\n', '')
s = s.replace('<script type="module" src="js/main.js"></script>', '<script>window.__TOSS__ = true</script>\n    <script type="module" src="js/main.js"></script>')
if (!s.includes('window.__TOSS__')) throw new Error('index.html에 토스 표시를 넣지 못했어요')
writeFileSync(html, s)
for (const f of ['manifest.webmanifest']) if (existsSync(join(out, f))) rmSync(join(out, f))
console.log('토스용 파일 준비 완료 →', relative(process.cwd(), out) || 'dist')
