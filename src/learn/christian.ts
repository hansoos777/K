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
    activities: [{"name": "기도", "text": "하나님께 마음을 털어놓고 감사와 바람을 아뢰는 대화입니다.", "meaning": "개신교는 누구나 예수 그리스도를 통해 하나님께 직접 나아갈 수 있다고 믿습니다(만인제사장). 정해진 형식보다 진실한 마음을 중시합니다.", "steps": ["조용한 곳에서 마음을 가라앉힙니다.", "하나님을 부르고 감사한 일을 먼저 말합니다.", "잘못을 돌아보고 용서를 구합니다.", "나와 이웃을 위한 바람을 아룁니다.", "“예수님의 이름으로 기도합니다. 아멘.”으로 마칩니다."], "img": "prayer", "place": "prayer"}, {"name": "예배", "text": "주일에 함께 모여 하나님을 높이고 말씀을 듣는 시간입니다.", "meaning": "부활하신 그리스도를 기념해 일요일(주일)에 드리며, 말씀 선포(설교)가 중심입니다. 성찬(주의 만찬)은 교회마다 정한 때에 함께 나눕니다.", "steps": ["예배 전 자리에 앉아 조용히 준비 기도를 합니다.", "찬송과 대표 기도에 함께합니다.", "성경 봉독과 설교를 듣습니다.", "헌금으로 감사를 표현합니다(선택).", "축도로 예배를 마칩니다."], "img": "traditional", "place": "traditional"}, {"name": "찬양", "text": "노래로 하나님께 감사와 고백을 드립니다.", "meaning": "종교개혁 이후 회중이 모국어로 함께 노래하는 전통이 자리 잡았습니다. 찬송가와 현대 찬양 모두 예배의 중요한 부분입니다.", "steps": ["가사의 뜻을 생각하며 듣습니다.", "따라 부르거나 마음속으로 함께합니다.", "노래가 끝나면 잠시 조용히 머뭅니다."], "img": "modern", "place": "modern"}, {"name": "성경 읽기", "text": "구약과 신약 66권을 차례로, 또는 계획을 세워 읽습니다.", "meaning": "개신교는 “오직 성경”을 강조하며, 누구나 스스로 성경을 읽고 이해하도록 권합니다.", "steps": ["하루에 읽을 분량을 정합니다(예: 복음서 한 장).", "천천히 읽고 마음에 남는 구절에 표시합니다.", "이해되지 않는 부분은 교회의 성경 공부나 해설을 참고합니다."], "img": "traditional"}, {"name": "묵상", "text": "짧은 말씀을 곱씹으며 오늘의 삶에 비추어 봅니다.", "meaning": "경건의 시간(QT)이라고도 부르며, 말씀을 읽고 생각하고 기도로 응답하는 개인 신앙 활동입니다.", "steps": ["짧은 본문을 두세 번 읽습니다.", "이 말씀이 나에게 무엇을 말하는지 생각합니다.", "깨달은 것을 짧게 적습니다.", "그 내용을 가지고 기도합니다."], "img": "prayer", "place": "prayer"}],
    figures: [{"name": "예수 그리스도", "text": "하나님의 아들이자 구원자로 믿는 분입니다. 십자가에서 죽고 사흘 만에 부활했다고 고백합니다."}, {"name": "빈 십자가", "text": "고난을 이기고 부활하셨음을 나타냅니다. 개신교 예배당에는 형상 없는 십자가를 둡니다."}, {"name": "성경", "text": "구약 39권과 신약 27권. 신앙과 삶의 기준입니다."}, {"name": "마르틴 루터", "text": "1517년 종교개혁을 시작한 독일의 신학자입니다. 개신교의 출발점으로 여겨집니다."}],
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
    activities: [{"name": "Prayer", "text": "An honest conversation with God: thanks, confession and requests.", "meaning": "Protestants believe anyone may come to God directly through Jesus Christ (the priesthood of all believers). A sincere heart matters more than set words.", "steps": ["Find a quiet place and settle your mind.", "Address God and begin with thanks.", "Reflect on wrongs and ask forgiveness.", "Bring your needs and those of others.", "Close with “In Jesus’ name, Amen.”"], "img": "prayer", "place": "prayer"}, {"name": "Worship", "text": "Gathering on Sunday to praise God and hear the Word.", "meaning": "Held on Sunday in memory of the resurrection, with the sermon at its centre. Communion (the Lord’s Supper) is shared at times each church sets.", "steps": ["Sit and pray quietly before the service.", "Join the hymns and the pastoral prayer.", "Listen to the Bible reading and sermon.", "Give an offering if you wish.", "The benediction closes the service."], "img": "traditional", "place": "traditional"}, {"name": "Praise", "text": "Thanks and confession offered in song.", "meaning": "Since the Reformation congregations have sung together in their own language. Hymns and contemporary songs are both part of worship.", "steps": ["Listen with the meaning of the words in mind.", "Sing along or join silently.", "Stay quiet for a moment when the song ends."], "img": "modern", "place": "modern"}, {"name": "Bible reading", "text": "Reading the 66 books in order or following a plan.", "meaning": "Protestants stress “Scripture alone” and encourage everyone to read the Bible for themselves.", "steps": ["Choose a daily portion, such as one chapter of a Gospel.", "Read slowly and mark verses that stay with you.", "Use a church study group or commentary for hard passages."], "img": "traditional"}, {"name": "Devotion", "text": "Turning over a short passage and applying it to today.", "meaning": "Often called quiet time: reading, reflecting and answering in prayer.", "steps": ["Read a short passage two or three times.", "Ask what it says to you.", "Write down a line of what you learned.", "Pray with it."], "img": "prayer", "place": "prayer"}],
    figures: [{"name": "Jesus Christ", "text": "Believed to be the Son of God and Saviour, who died on the cross and rose on the third day."}, {"name": "The empty cross", "text": "Points to the resurrection. Protestant churches use a cross without a figure."}, {"name": "The Bible", "text": "39 books of the Old Testament and 27 of the New: the rule of faith and life."}, {"name": "Martin Luther", "text": "German theologian who began the Reformation in 1517."}],
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
