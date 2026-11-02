// 빌드 결과 용량 보고: 첫 화면에 필요한 파일과 공간별 파일을 나눠 gzip 크기를 보여 준다.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { join } from 'node:path'

const dir = 'dist/assets'
const html = readFileSync('dist/index.html', 'utf8')
const rows = readdirSync(dir).map((f) => {
  const buf = readFileSync(join(dir, f))
  return { f, raw: statSync(join(dir, f)).size, gz: gzipSync(buf, { level: 9 }).length, initial: html.includes(f) }
})
const kb = (n) => (n / 1024).toFixed(1).padStart(7) + ' KB'
let initial = gzipSync(Buffer.from(html)).length
console.log('file'.padEnd(40), 'raw'.padStart(10), 'gzip'.padStart(10), ' when')
for (const r of rows.sort((a, b) => b.gz - a.gz)) {
  if (r.initial) initial += r.gz
  console.log(r.f.padEnd(40), kb(r.raw), kb(r.gz), r.initial ? ' 첫 화면' : ' 필요할 때')
}
console.log('\n첫 화면 전송량(gzip, HTML 포함):', kb(initial).trim())
