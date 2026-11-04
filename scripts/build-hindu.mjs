// 힌두교 모듈(PujaTime)을 빌드해 dist/hindu 에 넣는다. 랜선신앙의 npm run build 마지막에 실행.
import { execSync } from 'node:child_process'
import { existsSync, renameSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const mod = resolve('modules/pujatime')
const out = resolve('dist/hindu')
const run = (cmd, env = {}) => execSync(cmd, { cwd: mod, stdio: 'inherit', env: { ...process.env, ...env } })

if (!existsSync(resolve(mod, 'node_modules'))) run('npm ci --no-audit --no-fund')
run(`npx vite build --base /hindu/ --outDir "${out}" --emptyOutDir`, { ORUVIA_EMBED: '1' })

// PujaTime 코드는 신상 그림과 음원을 /deities, /audio 에서 찾음 → 맨 위로 옮김
for (const dir of ['deities', 'audio']) {
  const from = resolve(out, dir), to = resolve('dist', dir)
  if (existsSync(to)) rmSync(to, { recursive: true })
  if (existsSync(from)) renameSync(from, to)
}
// 관리자 화면·통계 API는 랜선신앙에서 쓰지 않음
for (const f of ['admin.html']) rmSync(resolve(out, f), { force: true })
console.log('hindu module built → dist/hindu')
