export const PUJATIME_URL = 'https://pujatime.pages.dev'

const ko = {
  intro: {
    mandir: '힌두교 사원(만디르)입니다. 신을 모신 가장 안쪽의 성소(가르바그리하) 위로 시카라 탑이 솟고, 사람들은 들어서며 종을 울리고 디야(기름 등잔)와 꽃을 올립니다.',
    pujatime: '힌두교 공간의 매일 푸자·나의 신전·아르티·찬가는 이미 만들어 둔 PujaTime에 있습니다. ORUVIA는 PujaTime을 새로 만들지 않고 그대로 이어 씁니다.',
  },
  scene: '시카라 탑과 성소 문, 종, 디야, 금잔화 꽃줄이 있는 만디르',
  ring: '사원 종(간타) 울리기',
  ringNote: '사원에 들어설 때 종을 울려 신께 왔음을 알리고 마음을 모읍니다.',
  diya: '디야 밝히기',
  diyaNote: '디야는 어둠을 몰아내는 빛, 무지를 걷어 내는 앎을 뜻합니다.',
  partsTitle: '만디르의 구조',
  parts: [
    ['가르바그리하', '신상을 모신 가장 안쪽의 작은 성소 ("자궁의 방")'],
    ['시카라', '성소 위로 솟은 탑, 신의 산을 뜻함'],
    ['만다파', '신자들이 모여 예배하는 기둥 홀'],
    ['간타', '입구에 매단 종'],
  ] as [string, string][],
  partsNote: '북인도(나가라) · 남인도(드라비다) 양식에 따라 모양이 크게 다릅니다.',
  open: 'PujaTime 열기',
  openNote: '새 탭에서 열립니다. PujaTime의 기록은 PujaTime에 그대로 남습니다.',
  hasTitle: 'PujaTime에 있는 것',
  has: ['나의 신전 꾸미기 (My Shrine)', '매일 푸자 · 종 · 램프 · 꽃 봉헌', '아르티', '12신 찬가 목록 (바잔 · 스토트람 · 만트라)', '축제 · 배우기 · 일기', '한국어 · 영어 · 힌디어'],
  planTitle: '통합 계획',
  plan: [
    'PujaTime 소스를 이 저장소로 가져와 src/worlds/mandir 안에서 그대로 동작하게 옮김 (재작성하지 않음)',
    '기존 저장 키(pujatime-v1)를 그대로 읽어 기록이 사라지지 않게 함',
    'PujaTime 단독 사이트·안드로이드 앱은 계속 따로 배포',
    'ORUVIA 공통 설정(언어·음량·움직임 줄이기)만 연결',
  ],
}

const en: typeof ko = {
  intro: {
    mandir: 'A Hindu temple (mandir). The shikhara tower rises above the innermost sanctum (garbhagriha); devotees ring the bell as they enter and offer diyas and flowers.',
    pujatime: 'Daily puja, My Shrine, aarti and devotional songs already live in PujaTime. ORUVIA does not rebuild it; it carries PujaTime forward as is.',
  },
  scene: 'A mandir with shikhara tower, sanctum door, bell, diyas and marigold garlands',
  ring: 'Ring the temple bell (ghanta)',
  ringNote: 'Devotees ring the bell on entering to announce their arrival and gather their attention.',
  diya: 'Light a diya',
  diyaNote: 'The diya is light that dispels darkness, knowledge that removes ignorance.',
  partsTitle: 'Parts of a mandir',
  parts: [
    ['Garbhagriha', 'The small innermost sanctum holding the deity ("womb chamber")'],
    ['Shikhara', 'The tower above the sanctum, evoking the mountain of the gods'],
    ['Mandapa', 'Pillared hall where devotees gather'],
    ['Ghanta', 'The bell hung at the entrance'],
  ],
  partsNote: 'Forms differ greatly between northern (Nagara) and southern (Dravida) styles.',
  open: 'Open PujaTime',
  openNote: 'Opens in a new tab. Your PujaTime records stay in PujaTime.',
  hasTitle: 'In PujaTime',
  has: ['My Shrine', 'Daily puja · bell · lamp · flower offerings', 'Aarti', 'Songs for 12 deities (bhajan · stotram · mantra)', 'Festivals · Learn · Journal', 'Korean · English · Hindi'],
  planTitle: 'Integration plan',
  plan: [
    'Bring the PujaTime source into this repo and run it inside src/worlds/mandir without rewriting',
    'Keep reading the existing storage key (pujatime-v1) so no records are lost',
    'Keep shipping the standalone PujaTime site and Android app',
    'Connect only shared ORUVIA settings (language, volume, reduced motion)',
  ],
}

export default { ko, en }
