// 예비 방법: 사용자가 구한 이미지가 없을 때만 쓴다(구한 이미지 우선, 출처는 public/statues/SOURCES.md).
// 실사 성상 이미지 만들기 (PC에서 실행). PujaTime scripts/murti/regen.mjs 와 같은 방식(FLUX.1 schnell, Apache 2.0).
// 사용: node scripts/statues/regen.mjs buddha mary crucifix      → scripts/statues/source/<id>.webp
//       node scripts/statues/cutout.mjs                         → public/statues/<id>.png (배경 제거)
// 토큰: 환경변수 HF_TOKEN, 없으면 ../pujatime/.env.local 의 HF_TOKEN 을 씀(저장소에 넣지 말 것)
import { createRequire } from 'module'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
const require = createRequire(new URL('../../modules/pujatime/package.json', import.meta.url))
const { Client } = require('@gradio/client')
process.on('unhandledRejection', (e) => { console.log('REJ', e?.message); process.exit(1) })

const envFile = new URL('../../../pujatime/.env.local', import.meta.url)
const token = process.env.HF_TOKEN ?? (existsSync(envFile) ? /HF_TOKEN=(\S+)/.exec(readFileSync(envFile, 'utf8'))?.[1] : undefined)
// --anon: 토큰 없이 접속(계정 한도를 다 썼을 때 IP별 무료 한도로 한 번 더 시도)
const anon = process.argv.includes('--anon')
if (!token && !anon) { console.log('HF_TOKEN 이 없습니다'); process.exit(1) }

const COMMON = 'full figure from the top of the head to the base, centered, front view, single sculpture, even soft studio light, plain pure white background, no text, no people, no extra limbs'
// 도상(형태)은 전통에 맞춰 적음. 결과는 반드시 눈으로 확인하고, 틀리면 넣지 않는다.
const LIST = {
  buddha: 'Korean Buddhist temple main hall statue of Shakyamuni Buddha seated in full lotus position on a lotus pedestal, earth-touching bhumisparsha mudra with the right hand resting over the right knee fingers pointing down, left hand resting palm up in the lap, snail-shell hair curls, ushnisha on top of the head, long earlobes, urna dot between the brows, serene half closed eyes, monastic robe over the left shoulder, gilt bronze covered in polished gold leaf, Joseon dynasty style, solid single piece',
  sacredheart: 'Catholic church statue of the Sacred Heart of Jesus standing on a small round base, carved white plaster in the same style as a white plaster statue of the Virgin Mary, right hand raised in blessing, left hand pointing to a red flaming heart encircled by thorns on his chest with golden rays, long robe and mantle, gentle peaceful bearded face, smooth matte white plaster, only the heart painted red and gold, dignified and modest',
  mary: 'classic pure white unpainted plaster statue of the Virgin Mary, entirely matte white plaster like a traditional Catholic church statue, no paint, no color, monochrome white, hands joined in prayer at the chest, veil, long robe and mantle with soft folds, gently downcast eyes, standing on a small round base, dignified and modest',
  crucifix: 'classic pure white unpainted plaster crucifix, the cross and the corpus of Jesus Christ both entirely matte white plaster, traditional Catholic church statue, no paint, no color, monochrome white, arms outstretched, crown of thorns, loincloth, head gently bowed, small INRI plaque at the top, no blood, no wounds, dignified and reverent, solid single piece',
}
// 흰 석고상은 흰 배경과 함께 지워지므로 어두운 회색 배경에서 만든다 (cutout.mjs 가 모서리 색을 배경으로 봄)
const BG = { mary: 'plain solid dark charcoal gray background', sacredheart: 'plain solid dark charcoal gray background', crucifix: 'plain solid dark charcoal gray background' }
const outDir = new URL('./source/', import.meta.url)
mkdirSync(outDir, { recursive: true })
const app = await Client.connect('black-forest-labs/FLUX.1-schnell', anon ? {} : { token, hf_token: token })
for (const id of process.argv.slice(2).filter((a) => a !== '--anon')) {
  if (!LIST[id]) { console.log(id, '목록에 없음'); continue }
  try {
    const r = await app.predict('/infer', { prompt: `${LIST[id]}, ${BG[id] ? COMMON.replace('plain pure white background', BG[id]) : COMMON}`, seed: 23, randomize_seed: false, width: 768, height: 1152, num_inference_steps: 4 })
    const img = Buffer.from(await (await fetch(r.data[0].url)).arrayBuffer())
    writeFileSync(new URL(`${id}.webp`, outDir), img)
    console.log(id, 'ok', img.length)
  } catch (e) { console.log(id, 'FAIL', e?.message) }
}
process.exit(0)
