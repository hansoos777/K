import type { LearnPack } from './types'

const pack: LearnPack = {
  ko: {
    title: '기독교 (개신교)',
    sub: '말씀과 은혜 · 예수 그리스도',
    intro: '기독교는 1세기 팔레스타인에서 살았던 예수 그리스도의 삶과 가르침, 십자가의 죽음과 부활을 믿는 종교입니다. 개신교는 1517년 마르틴 루터에서 시작된 종교개혁에서 갈라져 나왔으며, 한국에는 1885년 아펜젤러와 언더우드 선교사의 입국을 기점으로 널리 퍼졌습니다.',
    start: { title: '처음 교회에 가 보기', text: '교회에 들어가 자리에 앉고, 강단과 오르간을 둘러보며 예배의 흐름을 배우는 안내입니다.', place: 'traditional' },
    lessons: [
      { title: '무엇을 믿나요', body: ['하나님 아버지, 아들 예수 그리스도, 성령을 한 하나님으로 믿습니다(삼위일체).', '사람은 자기 행위가 아니라 예수 그리스도를 믿는 믿음으로 구원받는다고 고백합니다.'] },
      { title: '성경', body: ['개신교 성경은 구약 39권과 신약 27권, 모두 66권입니다.', '구약은 창조와 이스라엘의 역사·율법·예언을, 신약은 예수의 생애를 담은 네 복음서와 초대 교회의 이야기, 사도들의 편지를 담고 있습니다.'] },
      { title: '종교개혁', body: ['1517년 루터의 95개조 반박문에서 시작된 종교개혁은 "오직 성경, 오직 믿음, 오직 은혜"를 강조했습니다.', '오늘날 장로교·감리교·침례교·성결교·순복음 등 여러 교단이 있고, 예배 방식도 교단과 교회마다 다릅니다.'] },
      { title: '예배', body: ['예배는 찬송, 기도, 성경 봉독, 설교, 헌금, 축도로 이어지는 경우가 많고, 설교가 중심입니다.', '세례와 성찬을 성례로 지킵니다.', '전통 교회는 오르간과 성가대, 현대 교회는 찬양팀과 밴드가 예배 음악을 이끕니다.'] },
      { title: '교회의 공간', body: ['강단(강대상)은 말씀을 전하는 곳으로 예배당의 중심에 있습니다.', '십자가는 예수의 죽음과 부활을 기억하는 상징이며, 개신교 교회에는 보통 예수상이 없는 빈 십자가를 둡니다.'] },
    ],
    etiquette: ['예배 중에는 휴대전화를 무음으로 하고 조용히 합니다.', '늦게 도착하면 기도 시간을 피해 조용히 뒷자리에 앉습니다.', '함께 기도하거나 찬양에 참여하는 것은 자유이며, 처음 온 사람에게 강요하지 않습니다.', '헌금은 자율입니다.'],
    practice: [
      { label: '찬송 듣기', place: 'traditional', text: '오르간으로 옛 찬송을 듣습니다.' },
      { label: '침묵 기도', place: 'prayer', text: '기도실에서 시간을 정해 조용히 기도합니다.' },
      { label: '기도 노트', place: 'prayer', text: '나만 볼 수 있는 기도를 적어 둡니다.' },
      { label: '말씀 묵상', place: 'prayer', text: '성경 구절과 묵상 질문을 따라갑니다.' },
    ],
    festivals: [
      { name: '대림절', when: '성탄 전 4주', text: '예수의 오심을 기다립니다.' },
      { name: '성탄절', when: '12월 25일', text: '예수의 탄생을 기념합니다.' },
      { name: '사순절 · 고난주간', when: '부활절 전 40일', text: '예수의 고난을 묵상합니다.' },
      { name: '부활절', when: '춘분 뒤 첫 보름달 다음 주일', text: '예수의 부활을 기념합니다.' },
      { name: '성령강림절', when: '부활절 뒤 50일째', text: '성령이 내려온 날.' },
      { name: '추수감사절', when: '한국 교회는 대개 11월', text: '한 해의 은혜에 감사합니다.' },
    ],
    festivalNote: '교회력을 얼마나 지키는지는 교단과 교회마다 다릅니다.',
    sources: ['대한성서공회 성경 안내', '한국민족문화대백과사전 "개신교"', 'Encyclopaedia Britannica, "Protestantism"'],
  },
  en: {
    title: 'Christianity (Protestant)',
    sub: 'Word and grace · Jesus Christ',
    intro: 'Christianity is faith in the life and teaching, death on the cross and resurrection of Jesus Christ, who lived in 1st-century Palestine. Protestantism emerged from the Reformation begun by Martin Luther in 1517 and spread widely in Korea after missionaries Appenzeller and Underwood arrived in 1885.',
    start: { title: 'Your first church visit', text: 'Enter, take a seat, look at the pulpit and organ, and learn how a service flows.', place: 'traditional' },
    lessons: [
      { title: 'What Christians believe', body: ['One God as Father, Son (Jesus Christ) and Holy Spirit: the Trinity.', 'Salvation by faith in Jesus Christ rather than by one\'s own deeds.'] },
      { title: 'The Bible', body: ['The Protestant Bible has 66 books: 39 in the Old Testament and 27 in the New.', 'The Old Testament tells of creation, Israel\'s history, law and prophets; the New holds the four Gospels, Acts and the apostles\' letters.'] },
      { title: 'The Reformation', body: ['Begun with Luther\'s 95 Theses in 1517, it stressed Scripture alone, faith alone and grace alone.', 'Today there are many denominations — Presbyterian, Methodist, Baptist, Holiness, Pentecostal and more — with varied styles of worship.'] },
      { title: 'Worship', body: ['Services often move through hymns, prayer, Scripture reading, sermon, offering and benediction, centred on the sermon.', 'Baptism and the Lord\'s Supper are kept as sacraments.', 'Traditional churches use organ and choir; contemporary churches a worship band.'] },
      { title: 'The church space', body: ['The pulpit, where the Word is preached, stands at the centre.', 'The cross recalls Jesus\' death and resurrection; Protestant churches usually show an empty cross without a figure.'] },
    ],
    etiquette: ['Silence your phone and keep quiet during the service.', 'If late, enter quietly outside prayer time and sit at the back.', 'Joining in prayer or song is up to you; newcomers are never pressed.', 'Giving is voluntary.'],
    practice: [
      { label: 'Listen to a hymn', place: 'traditional', text: 'Hear an old hymn on the organ.' },
      { label: 'Silent prayer', place: 'prayer', text: 'Pray quietly for a set time.' },
      { label: 'Prayer notes', place: 'prayer', text: 'Keep private prayer notes.' },
      { label: 'Scripture reflection', place: 'prayer', text: 'Follow passages and reflection questions.' },
    ],
    festivals: [
      { name: 'Advent', when: '4 weeks before Christmas', text: 'Waiting for Christ\'s coming.' },
      { name: 'Christmas', when: '25 December', text: 'The birth of Jesus.' },
      { name: 'Lent · Holy Week', when: '40 days before Easter', text: 'Reflecting on Christ\'s suffering.' },
      { name: 'Easter', when: 'Sunday after the first full moon after the equinox', text: 'The resurrection.' },
      { name: 'Pentecost', when: '50th day after Easter', text: 'The coming of the Holy Spirit.' },
      { name: 'Thanksgiving', when: 'Usually November in Korea', text: 'Thanks for the year\'s blessings.' },
    ],
    festivalNote: 'How closely the church year is kept differs by denomination and congregation.',
    sources: ['Korean Bible Society', 'Encyclopedia of Korean Culture, "Protestantism"', 'Encyclopaedia Britannica, "Protestantism"'],
  },
}
export default pack
