import type { Gesture, SpotInfo, TourStep } from '../../ui/Space'

interface Pack { gestures: Gesture[]; spots: Record<string, SpotInfo>; tour: TourStep[]; aarti: string; aartiDone: string }

const ko: Pack = {
  gestures: [
    { id: 'namaste', label: '🙏 나마스테', pose: 'pray', note: '두 손을 가슴 앞에 모아 "나마스테" — 당신 안의 신성에 경의를' },
    { id: 'pranam', label: '프라남 (절)', pose: 'bow', note: '프라남: 고개와 몸을 숙여 신께 존경을 표합니다' },
  ],
  spots: {
    gate: { label: '사원 입구', text: '여기서 신발을 벗고 들어갑니다.' },
    bell: { label: '사원 종 (간타)', text: '들어서며 종을 울려 신께 왔음을 알립니다.', action: 'bell' },
    rangoli: { label: '랑골리', text: '쌀가루와 꽃잎으로 그린 문양. 손님과 신을 맞이하는 뜻입니다.' },
    sanctum: { label: '가르바그리하 (성소)', text: '신을 모신 가장 안쪽 방. 이곳에서 다르샨과 아르티를 드립니다.', action: 'aarti' },
  },
  tour: [
    { title: '힌두교에 오신 것을 환영합니다', text: '힌두교는 인도에서 수천 년 이어진 전통으로, 사원은 신을 손님처럼 맞이하고 마주하는(다르샨) 곳입니다.' },
    { title: '걷는 법', text: '왼쪽 아래 조이스틱을 밀거나 바닥을 누르면 걸어갑니다. 화면을 끌면 둘러볼 수 있어요. PC에서는 WASD 키를 씁니다.' },
    { title: '사원 입구로', text: '앞에 보이는 계단 쪽, 빛 기둥이 있는 곳까지 걸어가 보세요.', spot: 'gate' },
    { title: '예절: 신발을 벗어요', text: '사원에 들어가기 전 신발을 벗고, 단정한 옷차림을 합니다. 오른쪽의 "나마스테"를 눌러 인사해 보세요.', action: 'namaste' },
    { title: '종을 울려요', text: '들어서며 종을 울려 신께 왔음을 알리고 마음을 모읍니다. 아래 "사원 종" 버튼을 눌러 보세요.', action: 'bell' },
    { title: '만다파와 랑골리', text: '기둥이 늘어선 이곳은 신자들이 모이는 만다파입니다. 바닥 한가운데 랑골리까지 걸어가 보세요.', spot: 'rangoli' },
    { title: '가장 먼저 모시는 가네샤', text: '많은 사원에서는 장애를 없애는 가네샤를 가장 먼저 모십니다. 신상과 각 신의 이야기는 PujaTime에서 자세히 볼 수 있어요.' },
    { title: '푸자의 의미', text: '푸자는 신께 물·꽃·향·등불·음식을 올리는 예배입니다. 입구의 디야(등잔)를 밝혀 보세요.', action: 'diya' },
    { title: '아르티', text: '성소 앞에서 등불을 시계 방향으로 돌리며 노래하는 아르티를 드립니다. "아르티" 버튼을 누르면 성소 앞으로 걸어갑니다.', action: 'aarti' },
    { title: '더 알아보기', text: '매일 푸자, 나의 신전, 12신의 찬가는 PujaTime에 있습니다. 아래 "PujaTime" 버튼에서 이어서 해 보세요.' },
  ],
  aarti: '아르티',
  aartiDone: '성소 앞에서 아르티를 드립니다 — 종과 함께 디야가 하나씩 밝혀집니다',
}

const en: Pack = {
  gestures: [
    { id: 'namaste', label: '🙏 Namaste', pose: 'pray', note: 'Palms joined at the heart: "Namaste" — honouring the divine in you' },
    { id: 'pranam', label: 'Pranam (bow)', pose: 'bow', note: 'Pranam: bowing head and body in reverence' },
  ],
  spots: {
    gate: { label: 'Temple entrance', text: 'Shoes are removed here.' },
    bell: { label: 'Temple bell (ghanta)', text: 'Ring it as you enter to announce yourself.', action: 'bell' },
    rangoli: { label: 'Rangoli', text: 'A pattern of rice powder and petals welcoming guests and the divine.' },
    sanctum: { label: 'Garbhagriha (sanctum)', text: 'The inner chamber of the deity, where darshan and aarti are offered.', action: 'aarti' },
  },
  tour: [
    { title: 'Welcome to Hinduism', text: 'A tradition thousands of years old; the temple is where the deity is welcomed as a guest and seen (darshan).' },
    { title: 'How to walk', text: 'Push the joystick at bottom left or tap the floor. Drag to look around. On PC use WASD.' },
    { title: 'To the entrance', text: 'Walk to the column of light by the steps.', spot: 'gate' },
    { title: 'Etiquette: shoes off', text: 'Remove shoes and dress modestly. Tap "Namaste" on the right to greet.', action: 'namaste' },
    { title: 'Ring the bell', text: 'Ring the bell as you enter. Tap "Temple bell" below.', action: 'bell' },
    { title: 'Mandapa and rangoli', text: 'This pillared hall is the mandapa. Walk to the rangoli at its centre.', spot: 'rangoli' },
    { title: 'Ganesha first', text: 'Many temples honour Ganesha, remover of obstacles, first. Deities and their stories are in PujaTime.' },
    { title: 'What puja means', text: 'Puja offers water, flowers, incense, light and food. Light a diya at the entrance.', action: 'diya' },
    { title: 'Aarti', text: 'Before the sanctum a lamp is waved clockwise with song. Tap "Aarti" to walk to the sanctum.', action: 'aarti' },
    { title: 'Learn more', text: 'Daily puja, My Shrine and songs for 12 deities are in PujaTime. Continue with the "PujaTime" button.' },
  ],
  aarti: 'Aarti',
  aartiDone: 'Offering aarti before the sanctum — bell rings and diyas light one by one',
}
export default { ko, en }
