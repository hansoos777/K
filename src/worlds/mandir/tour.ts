import type { Gesture, SpotInfo, TourStep } from '../../ui/Space'

interface Pack { gestures: Gesture[]; spots: Record<string, SpotInfo>; tour: TourStep[]; aarti: string; aartiDone: string }

const ko: Pack = {
  gestures: [
    { id: 'namaste', label: '나마스테', pose: 'pray', note: '두 손을 가슴 앞에 모아 "나마스테" — 당신 안의 신성에 경의를' },
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
    { title: '사원 고르기', text: '아래 사원 목록에서 신을 고르고 "사원 안으로 들어가기"를 누르세요. 가네샤 사원부터 시작해 보세요.' },
    { title: '걷는 법', text: '사원 안에서는 왼쪽 아래 조이스틱이나 바닥을 눌러 걷고, 화면을 끌어 둘러봅니다.' },
    { title: '사원 입구로', text: '앞에 보이는 계단 쪽, 빛 기둥이 있는 곳까지 걸어가 보세요.', spot: 'gate' },
    { title: '예절: 신발을 벗어요', text: '사원에 들어가기 전 신발을 벗고 단정한 옷차림을 합니다. 아래 "합장" 버튼으로 두 손을 모아 나마스테 인사를 해 보세요.' },
    { title: '절하기 (프라남)', text: '"절하기"를 누르면 신 앞에 몸을 숙여 공경을 표합니다.' },
    { title: '만다파와 랑골리', text: '기둥이 늘어선 이곳은 신자들이 모이는 만다파입니다. 바닥 한가운데 랑골리까지 걸어가 보세요.', spot: 'rangoli' },
    { title: '가장 먼저 모시는 가네샤', text: '많은 사원에서는 장애를 없애는 가네샤를 가장 먼저 모십니다. 사원 소개 화면에서 각 신의 이야기를 볼 수 있어요.' },
    { title: '푸자의 의미', text: '푸자는 신께 물·꽃·향·등불·음식을 올리는 예배입니다. "램프 밝히기"로 등불을 올려 보세요.' },
    { title: '아르티와 찬가', text: '아르티는 등불을 시계 방향으로 돌리며 노래하는 의례입니다. "찬가"에서 신의 노래를 들어 보세요. 사원 소개 화면의 "여기서 푸자 하기"로 전체 푸자도 할 수 있어요.' },
    { title: '나의 신전', text: '위쪽 "나의 신전"에서 나만의 신당을 꾸미고 매일 푸자를 드릴 수 있어요.' },
  ],
  aarti: '아르티',
  aartiDone: '성소 앞에서 아르티를 드립니다 — 종과 함께 디야가 하나씩 밝혀집니다',
}

const en: Pack = {
  gestures: [
    { id: 'namaste', label: 'Namaste', pose: 'pray', note: 'Palms joined at the heart: "Namaste" — honouring the divine in you' },
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
    { title: 'Choose a temple', text: 'Pick a deity from the temple list and tap "Enter the temple". Ganesha\'s temple is a good start.' },
    { title: 'How to walk', text: 'Inside, use the joystick or tap the floor; drag to look around.' },
    { title: 'To the entrance', text: 'Walk to the column of light by the steps.', spot: 'gate' },
    { title: 'Etiquette: shoes off', text: 'Remove shoes and dress modestly. Use the joined-palms button to greet with Namaste.' },
    { title: 'Bow (pranam)', text: 'The bow button shows reverence before the deity.' },
    { title: 'Mandapa and rangoli', text: 'This pillared hall is the mandapa. Walk to the rangoli at its centre.', spot: 'rangoli' },
    { title: 'Ganesha first', text: 'Many temples honour Ganesha, remover of obstacles, first. Each deity\'s story is on the temple page.' },
    { title: 'What puja means', text: 'Puja offers water, flowers, incense, light and food. Light a lamp with the lamp button.' },
    { title: 'Aarti and songs', text: 'Aarti waves a lamp clockwise with song. Hear the deity\'s songs under "Songs", or do a full puja from the temple page.' },
    { title: 'My Shrine', text: 'Keep your own shrine and daily puja under "My Shrine" at the top.' },
  ],
  aarti: 'Aarti',
  aartiDone: 'Offering aarti before the sanctum — bell rings and diyas light one by one',
}
export default { ko, en }
