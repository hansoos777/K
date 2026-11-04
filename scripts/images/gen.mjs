// 사이트 사진 만들기 (PC에서 실행). scripts/statues/regen.mjs 와 같은 방식(FLUX.1 schnell, Apache 2.0).
// 사용: node scripts/images/gen.mjs            → 아직 없는 것만 전부
//       node scripts/images/gen.mjs home_hero   → 하나만 다시
// 결과: public/images/<id>.webp  (없으면 화면은 3D 공간 사진을 대신 보여 줌)
// 토큰: 환경변수 HF_TOKEN, 없으면 ../pujatime/.env.local 의 HF_TOKEN (저장소에 넣지 말 것)
// 만든 뒤 반드시 눈으로 확인: 종교 상징·의례가 틀리게 나온 것은 지우고 다시 만든다. 사람 얼굴이 정면으로 나온 것도 쓰지 않는다.
import { createRequire } from 'module'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
const require = createRequire(new URL('../../modules/pujatime/package.json', import.meta.url))
const { Client } = require('@gradio/client')
process.on('unhandledRejection', (e) => { console.log('REJ', e?.message); process.exit(1) })

const envFile = new URL('../../../pujatime/.env.local', import.meta.url)
const token = process.env.HF_TOKEN ?? (existsSync(envFile) ? /HF_TOKEN=(\S+)/.exec(readFileSync(envFile, 'utf8'))?.[1] : undefined)
if (!token) { console.log('HF_TOKEN 이 없습니다'); process.exit(1) }

// 느낌: docs/design/reference.png (사용자가 준 시안). 따뜻한 해 질 녘 빛, 옅은 안개, 파스텔 하늘, 깨끗한 건축.
// "약간 더 귀여워도 됨": 사실적이되 모양을 살짝 둥글고 단정하게 다듬은 미니어처 같은 3D 렌더 느낌.
// 단, 장난감·만화 캐릭터·과장된 색은 쓰지 않는다(종교 공간의 품위 유지).
const STYLE = 'soft semi-realistic 3D render with a gentle miniature diorama charm, slightly rounded and simplified clean shapes, warm golden hour sunlight, soft haze, pastel peach and ivory sky, warm muted ivory beige and bronze palette, cozy calm and dignified, tidy composition, soft shadows, high detail, no cartoon characters, no faces, no text, no watermark, no logo'
const W = [1216, 832] // 카드(3:2 가까이)
const H = [1536, 768] // 큰 배너
// [id, 크기, 장면]  — 종교 상징은 전통에 맞게. 개신교 사진에는 십자고상·성상을 넣지 않는다.
const LIST = [
  ['home_hero', H, 'a person seen from behind sitting cross-legged in meditation on a rock high on a mountain at sunrise, layers of misty mountains and a valley of fog, golden sun low on the horizon, pine trees, wide landscape with empty soft sky on the left side'],
  ['spaces_hero', H, 'a traditional Korean Buddhist temple hall with colorful dancheong eaves on a mountain at golden sunset, autumn trees, layered mountains in haze, wide landscape'],
  ['mine_hero', H, 'a calm minimal meditation room with a large round window looking out to green trees, light wooden floor, two linen floor cushions, a potted olive tree, warm morning sunlight, empty room, no people'],
  ['ext_christian', W, 'a small white Protestant church with a tall steeple topped by a simple plain cross on a green hill at sunset, mountains behind, no statues'],
  ['ext_catholic', W, 'the stone facade of a grand Gothic Catholic cathedral with twin towers and a rose window, blue sky with soft clouds, plaza in front, no people'],
  ['ext_temple', W, 'a traditional Korean Buddhist temple main hall with colorful dancheong painted eaves and curved tiled roof, stone steps, stone lantern, pine trees, clear sky'],
  ['ext_mandir', W, 'a tall South Indian Hindu temple gopuram tower densely carved with colorful figures, blue sky, palm trees, stone courtyard, no people'],
  // 신앙 활동 (src/learn/*.ts 의 activities 순서와 같음)
  ['act_christian_1', W, 'hands folded in prayer resting on a closed black leather Bible on a wooden table, soft window light, no text visible'],
  ['act_christian_2', W, 'interior of a bright traditional Protestant church during a Sunday service seen from the back rows, wooden pews, a plain wooden cross on the front wall above a pulpit, no statues, no faces visible'],
  ['act_christian_3', W, 'a grand piano and a few music stands in a bright simple wooden chapel with a plain cross on the wall, morning light, no people'],
  ['act_christian_4', W, 'an open Bible on a wooden lectern with soft light, pages blurred so no text is readable, a pencil and reading glasses beside it'],
  ['act_christian_5', W, 'a small notebook and an open Bible on a desk by a window at dawn with a cup of tea, quiet devotional time, text not readable'],
  ['act_catholic_1', W, 'rows of lit votive candles in red glass holders on an iron stand inside a dim stone Catholic church, warm glow'],
  ['act_catholic_2', W, 'a wooden Catholic rosary with a small crucifix resting on an old stone surface, soft warm light, shallow depth of field'],
  ['act_catholic_3', W, 'a carved stone relief of a Station of the Cross on the wall of a Catholic church with a small wooden cross above it, soft side light'],
  ['act_catholic_4', W, 'an Advent wreath with three purple candles and one rose candle on a wooden altar table in a Catholic church, soft light'],
  ['act_catholic_5', W, 'an open Catholic missal and lectionary on a wooden ambo with a ribbon marker, soft church light, text not readable'],
  ['act_temple_1', W, 'interior of a Korean Buddhist hall at dawn with a golden Buddha statue on the altar, incense smoke, candles, colorful lotus lanterns on the ceiling, no people'],
  ['act_temple_2', W, 'square meditation cushions in rows on a wooden floor of a quiet Korean Seon meditation hall with paper windows, soft light, no people'],
  ['act_temple_3', W, 'a red wooden moktak and its mallet on a wooden table in a Korean Buddhist temple, soft light'],
  ['act_temple_4', W, 'a padded prostration mat in front of an altar in a Korean Buddhist hall with a wooden 108 bead mala on it, soft warm light, no people'],
  ['act_temple_5', W, 'a brush, ink stone and a sheet of hanji paper with neat ink brush strokes on a low wooden table, Korean temple sutra copying, characters not readable'],
  ['act_mandir_1', W, 'a small home Hindu puja altar with brass oil diya lamps, marigold and jasmine flowers, a brass plate with fruit and incense, warm light'],
  ['act_mandir_2', W, 'a brass aarti lamp with several bright ghee flames held up in front of a softly lit Hindu temple shrine, motion of flames, hands only'],
  ['act_mandir_3', W, 'a rudraksha japa mala of 108 beads held in one hand, soft warm light, close up'],
  ['act_mandir_4', W, 'a single brass diya lamp flame burning in a quiet dark room, a few flower petals around it, calm meditative mood'],
  ['act_mandir_5', W, 'brass vessels of milk and water and a plate of marigold flowers prepared for abhisheka in a Hindu temple, soft light'],
]
const outDir = new URL('../../public/images/', import.meta.url)
mkdirSync(outDir, { recursive: true })
const want = process.argv.slice(2)
const app = await Client.connect('black-forest-labs/FLUX.1-schnell', { token, hf_token: token })
for (const [id, [width, height], scene] of LIST) {
  const out = new URL(`${id}.webp`, outDir)
  if (want.length ? !want.includes(id) : existsSync(out)) continue
  try {
    const r = await app.predict('/infer', { prompt: `${scene}, ${STYLE}`, seed: 7, randomize_seed: false, width, height, num_inference_steps: 4 })
    const img = Buffer.from(await (await fetch(r.data[0].url)).arrayBuffer())
    writeFileSync(out, img)
    console.log(id, 'ok', img.length)
  } catch (e) { console.log(id, 'FAIL', e?.message) }
}
process.exit(0)
