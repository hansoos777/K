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
if (!token) { console.log('HF_TOKEN 이 없습니다'); process.exit(1) }

const COMMON = 'full figure from the top of the head to the base, centered, front view, single sculpture, even soft studio light, plain pure white background, no text, no people, no extra limbs'
// 도상(형태)은 전통에 맞춰 적음. 결과는 반드시 눈으로 확인하고, 틀리면 넣지 않는다.
const LIST = {
  buddha: 'Korean Buddhist temple main hall statue of Shakyamuni Buddha seated in full lotus position on a lotus pedestal, earth-touching bhumisparsha mudra with the right hand resting over the right knee fingers pointing down, left hand resting palm up in the lap, snail-shell hair curls, ushnisha on top of the head, long earlobes, urna dot between the brows, serene half closed eyes, monastic robe over the left shoulder, gilt bronze covered in polished gold leaf, Joseon dynasty style, solid single piece',
  mary: 'Catholic church statue of the Virgin Mary standing on a small round base, hands joined in prayer at the chest, gentle downcast face, white veil and white robe, light blue mantle over the shoulders, simple halo of twelve small gold stars above the head, painted carved marble, dignified and modest',
  sacredheart: 'Catholic church statue of the Sacred Heart of Jesus standing on a small round base, carved white plaster in the same style as a white plaster statue of the Virgin Mary, right hand raised in blessing, left hand pointing to a red flaming heart encircled by thorns on his chest with golden rays, long robe and mantle, gentle peaceful bearded face, smooth matte white plaster, only the heart painted red and gold, dignified and modest',
  crucifix: 'Catholic church crucifix, the whole crucifix carved as one white plaster sculpture in the same style as a white plaster statue of the Virgin Mary, Jesus Christ on the cross with arms outstretched, crown of thorns, white loincloth, head gently bowed, peaceful dignified face, small INRI plaque at the top, smooth matte white plaster with soft shading, no paint, no color, no blood, no wounds shown, full cross visible from top to the foot, solid single piece',
}
const outDir = new URL('./source/', import.meta.url)
mkdirSync(outDir, { recursive: true })
const app = await Client.connect('black-forest-labs/FLUX.1-schnell', { token, hf_token: token })
for (const id of process.argv.slice(2)) {
  if (!LIST[id]) { console.log(id, '목록에 없음'); continue }
  try {
    const r = await app.predict('/infer', { prompt: `${LIST[id]}, ${COMMON}`, seed: 23, randomize_seed: false, width: 768, height: 1152, num_inference_steps: 4 })
    const img = Buffer.from(await (await fetch(r.data[0].url)).arrayBuffer())
    writeFileSync(new URL(`${id}.webp`, outDir), img)
    console.log(id, 'ok', img.length)
  } catch (e) { console.log(id, 'FAIL', e?.message) }
}
process.exit(0)
