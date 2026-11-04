import type { Gesture, SpotInfo, TourStep } from '../../ui/Space'
interface Pack { gestures: Gesture[]; spots: Record<string, SpotInfo>; tour: TourStep[]; tourHall: TourStep[] }
const ko: Pack = {
  gestures: [
    { id: 'hapjang', label: '합장', pose: 'pray', note: '두 손을 모아 마음을 하나로 — 합장' },
    { id: 'banbae', label: '반배', pose: 'bow', note: '합장한 채 허리를 굽혀 반배로 인사합니다' },
    { id: 'sit', label: '방석에 앉기', pose: 'sit', note: '빈 방석에 앉았어요. 움직이면 일어나요.' },
  ],
  spots: {
    gate: { label: '일주문', text: '기둥이 한 줄로 선 첫 문. 세속의 마음을 내려놓고 한마음으로 들어선다는 뜻입니다.' },
    pagoda: { label: '삼층 석탑', text: '부처님의 사리를 모신 탑. 시계 방향으로 돌며(탑돌이) 기도합니다.' },
    burner: { label: '향로', text: '향은 자신을 태워 주위를 맑게 합니다.', action: 'incense' },
    hall: { label: '대웅전', text: '석가모니 부처님을 모신 중심 법당. 가운데 문은 피하고 옆문으로 드나듭니다.' },
    bell: { label: '범종각', text: '범종을 쳐 볼 수 있어요. 새벽 28번, 저녁 33번 칩니다.', action: 'bell' },
    cushion: { label: '방석', text: '여기 앉아 호흡 명상을 해 보세요.', action: 'breath' },
    altar: { label: '불단', text: '부처님께 향과 초, 공양물을 올리는 곳입니다.', action: 'incense' },
  },
  tour: [
    { title: '사찰 마당에 오신 것을 환영합니다', text: '한국 사찰은 숲 속에 자리해, 걷는 길 자체가 수행이 됩니다.' },
    { title: '걷는 법', text: '왼쪽 아래 조이스틱이나 바닥을 눌러 걷고, 화면을 끌어 둘러보세요.' },
    { title: '일주문 지나기', text: '빛 기둥이 있는 일주문까지 걸어가 보세요.', spot: 'gate' },
    { title: '합장으로 인사', text: '절에서는 두 손을 모아 합장하고 반배합니다. 오른쪽 "반배"를 눌러 보세요.', action: 'banbae' },
    { title: '탑', text: '마당의 석탑까지 걸어가 보세요.', spot: 'pagoda' },
    { title: '향 올리기', text: '"향 피우기"를 누르면 향로 앞으로 가서 향을 올립니다.', action: 'incense' },
    { title: '범종', text: '"범종 치기"를 누르면 범종각으로 가서 종을 칩니다. 은은한 맥놀이를 들어 보세요.', action: 'bell' },
    { title: '연등', text: '"연등 켜기"로 마당의 연등을 하나씩 밝혀 보세요. 연등은 어둠을 밝히는 지혜를 뜻합니다.', action: 'lantern' },
    { title: '더 해 보기', text: '위쪽 "명상실"에서 호흡 명상을 해 볼 수 있어요.' },
  ],
  tourHall: [
    { title: '대웅전에 오신 것을 환영합니다', text: '석가모니 부처님을 모신 절의 중심 법당입니다. 법당에서는 조용히 하고 모자를 벗습니다.' },
    { title: '걷는 법', text: '왼쪽 아래 조이스틱이나 바닥을 눌러 걷고, 화면을 끌어 둘러보세요.' },
    { title: '합장', text: '두 손을 모아 마음을 하나로 모읍니다. 오른쪽 "합장"을 눌러 보세요.', action: 'hapjang' },
    { title: '부처님 앞으로', text: '가운데 통로를 따라 불단 앞, 빛 기둥이 있는 곳까지 걸어가 보세요. 부처님 정면을 가로지르지 않도록 해요.', spot: 'altar' },
    { title: '향 올리기', text: '"향 피우기"를 누르면 향을 올립니다. 향은 자신을 태워 주위를 맑게 한다는 뜻이에요.', action: 'incense' },
    { title: '삼배', text: '"삼배 올리기"로 부처님·가르침·스님(삼보)께 세 번 절합니다.', action: 'bow' },
    { title: '연등', text: '천장의 연등은 어둠을 밝히는 지혜를 뜻합니다. "연등 켜기"로 하나 밝혀 보세요.', action: 'lantern' },
    { title: '더 해 보기', text: '"사찰 마당"에서 일주문·탑·범종을, "명상실"에서 호흡 명상을 할 수 있어요.' },
  ],
}
const en: Pack = {
  gestures: [
    { id: 'hapjang', label: 'Hapjang', pose: 'pray', note: 'Palms joined, mind gathered — hapjang' },
    { id: 'banbae', label: 'Half bow', pose: 'bow', note: 'With joined palms, bow from the waist' },
    { id: 'sit', label: 'Sit on a cushion', pose: 'sit', note: 'Seated. Move to stand up.' },
  ],
  spots: {
    gate: { label: 'Iljumun', text: 'The One-Pillar Gate: entering with a single mind.' },
    pagoda: { label: 'Three-storey pagoda', text: 'Enshrines relics; people circle it clockwise in prayer.' },
    burner: { label: 'Incense burner', text: 'Incense burns itself to purify.', action: 'incense' },
    hall: { label: 'Daeungjeon', text: 'Main hall of Shakyamuni Buddha. Use the side doors, not the centre.' },
    bell: { label: 'Bell pavilion', text: 'Strike the great bell: 28 times at dawn, 33 at evening.', action: 'bell' },
    cushion: { label: 'Cushion', text: 'Sit here for breathing meditation.', action: 'breath' },
    altar: { label: 'Altar', text: 'Where incense, candles and offerings are made.', action: 'incense' },
  },
  tour: [
    { title: 'Welcome to the temple courtyard', text: 'Korean temples sit among forest; the walk itself is practice.' },
    { title: 'How to walk', text: 'Use the joystick or tap the floor; drag to look around.' },
    { title: 'Through the gate', text: 'Walk to the One-Pillar Gate in the column of light.', spot: 'gate' },
    { title: 'Greeting', text: 'Join palms and half bow. Tap "Half bow" on the right.', action: 'banbae' },
    { title: 'The pagoda', text: 'Walk to the stone pagoda.', spot: 'pagoda' },
    { title: 'Offer incense', text: 'Tap "Light incense" to walk to the burner.', action: 'incense' },
    { title: 'The great bell', text: 'Tap "Strike the bell" and listen to the slow swell.', action: 'bell' },
    { title: 'Lanterns', text: 'Light lotus lanterns: wisdom that lights the dark.', action: 'lantern' },
    { title: 'Go further', text: 'Try breathing meditation in the Meditation hall above.' },
  ],
  tourHall: [
    { title: 'Welcome to the main hall', text: 'The heart of the temple, enshrining Shakyamuni Buddha. Keep quiet and remove hats.' },
    { title: 'How to walk', text: 'Use the joystick or tap the floor; drag to look around.' },
    { title: 'Hapjang', text: 'Join your palms. Tap "Hapjang" on the right.', action: 'hapjang' },
    { title: 'Before the Buddha', text: 'Walk up the centre to the light before the altar, without crossing directly in front of the Buddha.', spot: 'altar' },
    { title: 'Offer incense', text: 'Tap "Light incense".', action: 'incense' },
    { title: 'Three bows', text: 'Bow three times to the Buddha, Dharma and Sangha.', action: 'bow' },
    { title: 'Lanterns', text: 'Lanterns stand for wisdom; light one.', action: 'lantern' },
    { title: 'Go further', text: 'Visit the courtyard for the gate, pagoda and bell, or the meditation hall.' },
  ],
}
export default { ko, en }
