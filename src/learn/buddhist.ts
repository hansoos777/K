import type { LearnPack } from './types'

const pack: LearnPack = {
  ko: {
    title: '불교',
    sub: '깨달음의 길 · 불법승 삼보',
    intro: '불교는 기원전 5세기 무렵 인도에서 싯다르타 고타마가 깨달음을 얻어 붓다(깨달은 이)가 된 뒤 전한 가르침에서 시작했습니다. 남방의 상좌부, 동아시아의 대승, 티베트의 금강승으로 퍼졌고, 한국에는 4세기 고구려 때(372년) 전해져 1,600년 넘게 이어지고 있습니다.',
    start: { title: '처음 산사에 가 보기', text: '일주문을 지나 탑과 향로, 대웅전, 범종각까지 걸으며 절의 구조와 예절을 배우는 안내입니다.', place: 'sansa' },
    lessons: [
      { title: '붓다의 생애', body: ['룸비니에서 태어난 싯다르타 왕자는 늙음·병듦·죽음을 보고 출가해, 보드가야의 보리수 아래에서 깨달음을 얻었습니다.', '녹야원에서 처음 가르침을 폈고(초전법륜), 쿠시나가라에서 열반에 들었습니다.'] },
      { title: '핵심 가르침', body: ['사성제: 삶에는 괴로움(고)이 있고, 그 원인(집)이 있으며, 괴로움은 사라질 수 있고(멸), 그 길(도)이 있다.', '팔정도: 바른 견해·생각·말·행동·생활·노력·마음챙김·집중.', '모든 것은 변하고(무상), 고정된 나는 없다(무아)는 가르침, 그리고 양극단을 피하는 중도.'] },
      { title: '삼보와 한국 불교', body: ['부처(불), 가르침(법), 수행 공동체(승)를 삼보라 하며 불자는 삼보에 귀의합니다.', '한국 불교는 대승불교로, 조계종·태고종·천태종 등 여러 종단이 있고 참선(간화선)과 염불, 경전 공부를 함께 합니다.'] },
      { title: '절의 구조', body: ['일주문 → 천왕문(사천왕) → 불이문을 지나면 탑과 대웅전이 있는 마당에 이릅니다.', '범종각에는 범종·법고·목어·운판, 네 가지 법구(사물)가 있어 아침저녁 예불 때 칩니다.', '대웅전은 석가모니 부처님을 모신 중심 법당이며, 처마 아래 단청은 나무를 보호하고 장엄합니다.'] },
      { title: '명상과 예불', body: ['명상은 숨과 몸, 마음을 있는 그대로 알아차리는 수행입니다. 한국 선방에서는 죽비 소리로 시작과 끝을 알립니다.', '새벽과 저녁 예불, 108배, 연등 공양이 대표적인 신행입니다.'] },
    ],
    etiquette: [
      '스님이나 다른 불자를 만나면 두 손을 모아 합장하고 허리를 굽혀 반배합니다.',
      '법당에는 가운데 문(어간문)을 피해 옆문으로 드나들고, 부처님 정면을 가로지르지 않습니다.',
      '법당 안에서는 모자를 벗고 조용히 합니다.',
      '불상과 불구는 만지지 않고, 사진은 허락된 곳에서만 찍습니다.',
      '탑은 시계 방향으로 돕니다(탑돌이).',
    ],
    practice: [
      { label: '연등 켜기', place: 'sansa', text: '마당의 연등에 불을 밝힙니다.' },
      { label: '범종 치기', place: 'sansa', text: '범종각에서 범종을 칩니다.' },
      { label: '향 피우기', place: 'sansa', text: '대웅전 앞 향로에 향을 올립니다.' },
      { label: '호흡 명상', place: 'meditation', text: '명상실 방석에 앉아 숨을 따라갑니다.' },
    ],
    festivals: [
      { name: '부처님오신날', when: '음력 4월 8일', text: '연등을 밝혀 붓다의 탄생을 기념합니다.' },
      { name: '출가재일', when: '음력 2월 8일', text: '붓다가 출가한 날.' },
      { name: '열반재일', when: '음력 2월 15일', text: '붓다가 열반에 든 날.' },
      { name: '성도재일', when: '음력 12월 8일', text: '붓다가 깨달음을 얻은 날.' },
      { name: '우란분절(백중)', when: '음력 7월 15일', text: '돌아가신 부모와 조상을 위해 기도합니다.' },
    ],
    festivalNote: '한국 불교 명절은 음력을 따르므로 양력 날짜가 해마다 바뀝니다. 상좌부 불교권에서는 붓다의 탄생·깨달음·열반을 함께 기리는 웨삭(베삭)을 지냅니다.',
    sources: ['대한불교조계종 신행 안내', '한국민족문화대백과사전 "불교"', 'Encyclopaedia Britannica, "Buddhism"'],
  },
  en: {
    title: 'Buddhism',
    sub: 'The path of awakening · the Three Jewels',
    intro: 'Buddhism began with the teaching of Siddhartha Gautama, who became the Buddha (the awakened one) in India around the 5th century BCE. It spread as Theravada in the south, Mahayana in East Asia and Vajrayana in Tibet, and reached Korea in 372 CE, continuing for over 1,600 years.',
    start: { title: 'Your first mountain temple', text: 'Walk from the gate past the pagoda and incense burner to the main hall and bell pavilion, learning the layout and manners.', place: 'sansa' },
    lessons: [
      { title: 'Life of the Buddha', body: ['Born in Lumbini, Prince Siddhartha left home after seeing old age, sickness and death, and awakened under the Bodhi tree at Bodh Gaya.', 'He first taught at Sarnath and passed into parinirvana at Kushinagar.'] },
      { title: 'Core teachings', body: ['The Four Noble Truths: suffering, its cause, its cessation, and the path.', 'The Noble Eightfold Path: right view, intention, speech, action, livelihood, effort, mindfulness and concentration.', 'Impermanence, non-self and the Middle Way between extremes.'] },
      { title: 'The Three Jewels and Korean Buddhism', body: ['Buddhists take refuge in the Buddha, the Dharma (teaching) and the Sangha (community).', 'Korean Buddhism is Mahayana, with orders such as Jogye, Taego and Cheontae, combining Seon meditation, chanting and study.'] },
      { title: 'Temple layout', body: ['Iljumun → Cheonwangmun (Four Heavenly Kings) → Bulimun lead to the courtyard with the pagoda and main hall.', 'The bell pavilion holds the four instruments: bell, drum, wooden fish and cloud gong, struck at dawn and evening services.', 'The main hall enshrines Shakyamuni Buddha; the painted dancheong protects and adorns the wood.'] },
      { title: 'Meditation and services', body: ['Meditation is knowing breath, body and mind as they are. In Korean halls, the jukbi clapper marks the start and end.', 'Dawn and evening services, 108 prostrations and lantern offerings are common practices.'] },
    ],
    etiquette: ['Greet monks and others with joined palms and a half bow.', 'Use the side doors of a hall, not the central door, and do not cross directly in front of the Buddha.', 'Remove hats and keep quiet inside halls.', 'Do not touch statues or ritual objects; photograph only where allowed.', 'Walk around a pagoda clockwise.'],
    practice: [
      { label: 'Light a lantern', place: 'sansa', text: 'Light lotus lanterns in the courtyard.' },
      { label: 'Strike the bell', place: 'sansa', text: 'Strike the great bell in its pavilion.' },
      { label: 'Offer incense', place: 'sansa', text: 'Offer incense before the main hall.' },
      { label: 'Breathing meditation', place: 'meditation', text: 'Sit on a cushion and follow your breath.' },
    ],
    festivals: [
      { name: "Buddha's Birthday", when: '8th day, 4th lunar month', text: 'Lanterns celebrate the Buddha\'s birth.' },
      { name: 'Renunciation Day', when: '8th day, 2nd lunar month', text: 'The day he left home.' },
      { name: 'Nirvana Day', when: '15th day, 2nd lunar month', text: 'His parinirvana.' },
      { name: 'Enlightenment Day', when: '8th day, 12th lunar month', text: 'His awakening.' },
      { name: 'Ullambana (Baekjung)', when: '15th day, 7th lunar month', text: 'Prayers for departed parents and ancestors.' },
    ],
    festivalNote: 'Korean Buddhist holidays follow the lunar calendar. Theravada countries celebrate Vesak, honouring birth, awakening and parinirvana together.',
    sources: ['Jogye Order of Korean Buddhism', 'Encyclopedia of Korean Culture, "Buddhism"', 'Encyclopaedia Britannica, "Buddhism"'],
  },
}
export default pack
