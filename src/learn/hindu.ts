import type { LearnPack } from './types'

const pack: LearnPack = {
  ko: {
    title: '힌두교',
    sub: '사나타나 다르마 · 영원한 길',
    intro: '힌두교는 인도 아대륙에서 수천 년에 걸쳐 형성된 전통으로, 한 명의 창시자나 하나의 경전 대신 베다·우파니샤드 같은 오랜 경전과 다양한 지역 전통이 함께 이어져 왔습니다. 오늘날 약 12억 명이 믿으며, 같은 힌두교 안에서도 섬기는 신과 의례가 지역과 종파에 따라 크게 다릅니다.',
    start: { title: '처음 사원에 가 보기', text: '사원을 고르고 들어가 합장·절·램프 밝히기까지 천천히 따라 해 보는 안내입니다.', place: 'mandir' },
    lessons: [
      { title: '힌두교는 어떤 종교인가요', body: ['모든 것의 근원인 브라만, 삶과 죽음이 되풀이된다는 윤회(삼사라), 행위의 결과인 카르마, 해탈(목샤)이 중요한 개념입니다.', '베다와 우파니샤드, 서사시 라마야나와 마하바라타, 그 안의 바가바드 기타가 널리 읽힙니다.'] },
      { title: '주요 신들', body: ['창조·유지·파괴를 맡는 브라흐마·비슈누·시바를 삼신(트리무르티)이라 부릅니다.', '가네샤는 장애를 없애는 신으로 의례에서 가장 먼저 모십니다. 락슈미(풍요), 사라스와티(지혜와 예술), 두르가와 칼리(악을 물리치는 여신), 하누만(헌신과 힘)도 널리 섬깁니다.', '라마와 크리슈나는 비슈누가 세상에 내려온 화신(아바타라)으로 여겨집니다.', '어떤 신을 가장 높이 섬기는지는 종파(바이슈나바·샤이바·샥타 등)에 따라 다릅니다.'] },
      { title: '사원(만디르)의 구조', body: ['가장 안쪽의 작은 성소 가르바그리하("자궁의 방")에 신상을 모십니다.', '그 위로 신의 산을 뜻하는 탑이 솟는데, 북인도 나가라 양식은 시카라, 남인도 드라비다 양식은 비마나라 부르고, 남인도 사원은 커다란 문탑(고푸람)으로도 유명합니다.', '신자들이 모이는 기둥 홀을 만다파라고 합니다.'] },
      { title: '푸자와 아르티', body: ['푸자는 신을 귀한 손님처럼 맞이해 물·꽃·향·등불·음식을 올리는 예배입니다. 올린 음식은 신의 축복이 담긴 프라사드로 나누어 먹습니다.', '아르티는 기름이나 장뇌 등불을 신 앞에서 시계 방향으로 돌리며 노래하는 의례로, 보통 푸자의 끝에 합니다.', '신상을 바라보며 신과 눈을 마주하는 것을 다르샨이라 하며, 사원 방문의 핵심입니다.'] },
      { title: '만트라와 바잔', body: ['만트라는 정해진 소리와 말로 마음을 모으는 기도입니다. 가장 널리 알려진 것은 옴(ॐ)과 리그베다의 가야트리 만트라입니다.', '바잔은 신을 찬양하는 노래로, 함께 부르는 모임(키르탄)도 있습니다.'] },
    ],
    etiquette: [
      '사원에 들어가기 전에 신발을 벗습니다.',
      '어깨와 무릎을 가리는 단정한 옷을 입습니다. 가죽 소지품을 삼가는 사원도 있습니다.',
      '들어설 때 종을 울려 왔음을 알리고, 합장하며 "나마스테"로 인사합니다.',
      '성소와 신상은 허락 없이 만지지 않고, 사진은 허용된 곳에서만 찍습니다.',
      '성소 둘레는 시계 방향(오른쪽 어깨가 안쪽)으로 돕니다.',
      '프라사드와 공물은 오른손으로 주고받습니다.',
    ],
    practice: [
      { label: '사원 방문 · 다르샨', place: 'mandir', text: '12신의 사원에 들어가 신을 마주하고 합장·절을 올립니다.' },
      { label: '램프 밝히기 · 찬가', place: 'mandir', text: '사원 안에서 등불을 올리고 신의 찬가를 듣습니다.' },
      { label: '나의 신전 · 매일 푸자', place: 'shrine', text: '나만의 신당을 꾸미고 매일 푸자를 드립니다.' },
    ],
    festivals: [
      { name: '디왈리', when: '10~11월', text: '빛의 축제. 집집마다 디야를 밝히고 락슈미를 모십니다.' },
      { name: '홀리', when: '3월', text: '봄을 맞아 색 가루를 뿌리며 함께 즐깁니다.' },
      { name: '나바라트리 · 두르가 푸자', when: '9~10월', text: '아홉 밤 동안 여신을 섬깁니다.' },
      { name: '가네샤 차투르티', when: '8~9월', text: '가네샤의 탄생을 기념합니다.' },
      { name: '마하 시바라트리', when: '2~3월', text: '시바를 기리며 밤새 기도합니다.' },
      { name: '크리슈나 잔마슈타미', when: '8~9월', text: '크리슈나의 탄생을 기념합니다.' },
    ],
    festivalNote: '힌두 축제는 음력·태양력을 함께 쓰는 달력을 따르므로 날짜가 해마다 바뀝니다. 정확한 날짜는 힌두교 사원의 축제 일정에서 볼 수 있어요.',
    sources: ['Encyclopaedia Britannica, "Hinduism"', '한국민족문화대백과사전 · 두산백과의 힌두교 항목', '힌두교 사원 축제·신 자료'],
  },
  en: {
    title: 'Hinduism',
    sub: 'Sanatana Dharma · the eternal way',
    intro: 'Hinduism took shape over thousands of years in the Indian subcontinent. Instead of one founder or one book, it carries ancient scriptures such as the Vedas and Upanishads together with many regional traditions. About 1.2 billion people follow it today, and deities and rites vary widely by region and tradition.',
    start: { title: 'Your first temple visit', text: 'Choose a temple, enter, greet, bow and light a lamp, step by step.', place: 'mandir' },
    lessons: [
      { title: 'What is Hinduism', body: ['Key ideas include Brahman (the ultimate reality), samsara (the cycle of rebirth), karma and moksha (liberation).', 'The Vedas, Upanishads, the epics Ramayana and Mahabharata, and the Bhagavad Gita are widely read.'] },
      { title: 'Major deities', body: ['Brahma, Vishnu and Shiva (the Trimurti) create, preserve and dissolve.', 'Ganesha, remover of obstacles, is honoured first. Lakshmi (prosperity), Saraswati (wisdom and arts), Durga and Kali (who defeat evil) and Hanuman (devotion and strength) are widely worshipped.', 'Rama and Krishna are revered as avatars of Vishnu.', 'Which deity is held supreme differs between traditions (Vaishnava, Shaiva, Shakta and others).'] },
      { title: 'The mandir', body: ['The deity rests in the small inner sanctum, the garbhagriha ("womb chamber").', 'Above it rises a tower evoking the mountain of the gods: the shikhara in the northern Nagara style, the vimana in the southern Dravida style, where huge gate towers (gopurams) are also famous.', 'Devotees gather in the pillared mandapa.'] },
      { title: 'Puja and aarti', body: ['In puja the deity is welcomed like an honoured guest with water, flowers, incense, light and food. Offered food is shared as prasad, carrying the blessing.', 'Aarti is waving a lamp clockwise before the deity while singing, usually at the end of puja.', 'Seeing and being seen by the deity is darshan, the heart of a temple visit.'] },
      { title: 'Mantra and bhajan', body: ['A mantra gathers the mind with set sounds and words. Om and the Gayatri mantra of the Rigveda are best known.', 'Bhajans are devotional songs, also sung together in kirtan.'] },
    ],
    etiquette: ['Remove your shoes before entering.', 'Dress modestly, covering shoulders and knees. Some temples ask visitors to avoid leather.', 'Ring the bell as you enter and greet with joined palms: "Namaste".', 'Do not touch the sanctum or deity without permission; photograph only where allowed.', 'Walk around the sanctum clockwise.', 'Give and receive prasad and offerings with the right hand.'],
    practice: [
      { label: 'Temple visit · darshan', place: 'mandir', text: 'Enter the temples of 12 deities and greet them.' },
      { label: 'Lamps · songs', place: 'mandir', text: 'Offer a lamp and hear devotional songs inside.' },
      { label: 'My Shrine · Daily Puja', place: 'shrine', text: 'Keep your own shrine and daily puja.' },
    ],
    festivals: [
      { name: 'Diwali', when: 'Oct–Nov', text: 'Festival of lights; lamps are lit and Lakshmi is worshipped.' },
      { name: 'Holi', when: 'March', text: 'Spring festival of colours.' },
      { name: 'Navaratri · Durga Puja', when: 'Sep–Oct', text: 'Nine nights honouring the Goddess.' },
      { name: 'Ganesh Chaturthi', when: 'Aug–Sep', text: 'Celebrates the birth of Ganesha.' },
      { name: 'Maha Shivaratri', when: 'Feb–Mar', text: 'A night of prayer to Shiva.' },
      { name: 'Krishna Janmashtami', when: 'Aug–Sep', text: 'Celebrates the birth of Krishna.' },
    ],
    festivalNote: 'Hindu festivals follow a lunisolar calendar, so dates change every year. See the festival schedule in the Hindu temples for exact dates.',
    sources: ['Encyclopaedia Britannica, "Hinduism"', 'Encyclopedia of Korean Culture · Doopedia entries on Hinduism', 'Hindu temple festival and deity data'],
  },
}
export default pack
