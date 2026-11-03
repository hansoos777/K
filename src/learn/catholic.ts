import type { LearnPack } from './types'

const pack: LearnPack = {
  ko: {
    title: '천주교 (가톨릭)',
    sub: '보편 교회 · 성사와 전례',
    intro: '가톨릭은 "보편적"이라는 뜻으로, 사도들로부터 이어진 교회가 교황을 중심으로 하나의 공동체를 이룹니다. 한국 천주교는 1784년 이승훈이 북경에서 세례를 받고 돌아오면서 평신도 스스로 시작한 드문 역사를 가졌고, 박해 속 순교자 103위가 1984년 성인으로 선포되었습니다.',
    start: { title: '처음 성당에 가 보기', text: '성수로 십자성호를 긋고, 신자석과 제대, 봉헌초, 십자가의 길을 차례로 둘러보는 안내입니다.', place: 'gothic' },
    lessons: [
      { title: '무엇을 믿나요', body: ['성부·성자·성령 삼위일체 하느님과 예수 그리스도의 죽음과 부활을 믿습니다.', '성경과 함께 교회가 전해 온 거룩한 전통(성전)을 소중히 여깁니다.', '가톨릭 성경은 구약 46권과 신약 27권, 모두 73권입니다.'] },
      { title: '일곱 성사', body: ['세례·견진·성체·고해·병자·성품·혼인 성사가 있습니다.', '성사는 사제를 통해 실제로 받는 것으로, 가상 공간에서는 받을 수 없습니다.'] },
      { title: '미사', body: ['미사는 말씀 전례와 성찬 전례를 중심으로, 시작 예식과 마침 예식으로 이루어집니다.', '영성체는 세례를 받은 가톨릭 신자가 모십니다. 신자가 아닌 사람은 앉아 있거나, 앞으로 나가 두 팔을 가슴에 모아 사제에게 강복을 청할 수 있습니다.'] },
      { title: '성모 마리아와 성인', body: ['가톨릭은 예수의 어머니 마리아와 성인들을 공경하며 그들의 전구(대신 빌어 줌)를 청합니다.', '흠숭(경배)은 하느님께만 드리고, 마리아와 성인에게는 공경을 드린다는 점을 구분합니다.'] },
      { title: '성당의 공간', body: ['제대는 미사의 중심, 감실은 성체를 모신 곳이며 곁에 감실등이 늘 켜져 있습니다.', '대성당(주교좌 성당)은 교구장 주교의 의자가 있는 성당으로, 모든 성당이 대성당은 아닙니다. 서울의 주교좌는 명동대성당입니다.', '고딕 양식은 뾰족 아치와 높은 천장, 큰 스테인드글라스, 로마네스크 양식은 둥근 아치와 두꺼운 벽이 특징입니다.'] },
    ],
    etiquette: ['성당에 들어설 때 성수를 찍어 십자성호를 긋습니다(신자가 아니면 생략해도 됩니다).', '감실을 향해 가볍게 고개 숙여 절합니다.', '미사 중에는 조용히 하고, 사진은 삼갑니다.', '영성체는 신자만 모십니다.', '고해소는 성사를 위한 곳이므로 함부로 들어가지 않습니다.'],
    practice: [
      { label: '촛불 봉헌', place: 'grotto', text: '성모 동산에서 초를 밝힙니다.' },
      { label: '묵주기도', place: 'grotto', text: '오늘의 신비를 따라 묵주기도를 바칩니다.' },
      { label: '십자가의 길', place: 'gothic', text: '14처를 따라 예수의 수난을 묵상합니다.' },
      { label: '전례력', place: 'parish', text: '지금의 전례 시기와 다가오는 대축일을 봅니다.' },
    ],
    festivals: [
      { name: '주님 성탄 대축일', when: '12월 25일', text: '예수의 탄생.' },
      { name: '천주의 성모 마리아 대축일', when: '1월 1일', text: '마리아가 하느님의 어머니임을 기념.' },
      { name: '주님 부활 대축일', when: '춘분 뒤 첫 보름 다음 주일', text: '예수의 부활.' },
      { name: '성모 승천 대축일', when: '8월 15일', text: '마리아가 하늘에 올림을 받음.' },
      { name: '한국 순교자 대축일', when: '9월 20일', text: '한국의 순교 성인들을 기림.' },
      { name: '위령의 날', when: '11월 2일', text: '세상을 떠난 이들을 위해 기도.' },
    ],
    festivalNote: '올해의 정확한 날짜와 지금의 전례 시기는 본당의 "전례력"에서 볼 수 있습니다.',
    sources: ['한국천주교주교회의 가톨릭 정보', '가톨릭 교회 교리서', 'Encyclopaedia Britannica, "Roman Catholicism"'],
  },
  en: {
    title: 'Catholicism',
    sub: 'The universal Church · sacraments and liturgy',
    intro: '"Catholic" means universal: the Church continuing from the apostles, united around the Pope. Korean Catholicism began unusually with lay people, when Yi Seung-hun returned from baptism in Beijing in 1784; 103 Korean martyrs were canonised in 1984.',
    start: { title: 'Your first cathedral visit', text: 'Make the sign of the cross with holy water, then visit the nave, altar, votive candles and Stations of the Cross.', place: 'gothic' },
    lessons: [
      { title: 'What Catholics believe', body: ['The Triune God — Father, Son and Holy Spirit — and the death and resurrection of Jesus Christ.', 'Sacred Tradition is held together with Scripture.', 'The Catholic Bible has 73 books: 46 Old Testament and 27 New Testament.'] },
      { title: 'The seven sacraments', body: ['Baptism, Confirmation, Eucharist, Penance, Anointing of the Sick, Holy Orders and Matrimony.', 'Sacraments are received in person through a priest; they cannot be received in a virtual space.'] },
      { title: 'The Mass', body: ['The Mass centres on the Liturgy of the Word and the Liturgy of the Eucharist, framed by introductory and concluding rites.', 'Communion is received by baptised Catholics. Others may remain seated or come forward with arms crossed for a blessing.'] },
      { title: 'Mary and the saints', body: ['Catholics honour Mary, mother of Jesus, and the saints, asking their intercession.', 'Worship (latria) is for God alone; Mary and the saints receive veneration.'] },
      { title: 'The church space', body: ['The altar is the centre of the Mass; the tabernacle holds the Blessed Sacrament, with a lamp always lit.', 'A cathedral holds the bishop\'s chair; not every church is a cathedral. Seoul\'s is Myeongdong Cathedral.', 'Gothic: pointed arches, high vaults, great stained glass. Romanesque: round arches and thick walls.'] },
    ],
    etiquette: ['On entering, make the sign of the cross with holy water (optional for non-Catholics).', 'Bow toward the tabernacle.', 'Keep quiet and avoid photos during Mass.', 'Only Catholics receive Communion.', 'The confessional is for the sacrament; do not enter casually.'],
    practice: [
      { label: 'Light a candle', place: 'grotto', text: 'Light a votive candle at the Marian grotto.' },
      { label: 'The Rosary', place: 'grotto', text: 'Pray the Rosary with today\'s mysteries.' },
      { label: 'Stations of the Cross', place: 'gothic', text: 'Reflect on the Passion through 14 stations.' },
      { label: 'Liturgical calendar', place: 'parish', text: 'See the current season and coming feasts.' },
    ],
    festivals: [
      { name: 'Christmas', when: '25 December', text: 'The birth of Jesus.' },
      { name: 'Mary, Mother of God', when: '1 January', text: 'Mary as Mother of God.' },
      { name: 'Easter Sunday', when: 'Sunday after the first full moon after the equinox', text: 'The resurrection.' },
      { name: 'Assumption', when: '15 August', text: 'Mary taken up into heaven.' },
      { name: 'Korean Martyrs', when: '20 September', text: 'Honouring Korea\'s martyr saints.' },
      { name: 'All Souls', when: '2 November', text: 'Prayer for the departed.' },
    ],
    festivalNote: 'See the parish "Liturgical calendar" for this year\'s exact dates and current season.',
    sources: ['Catholic Bishops\' Conference of Korea', 'Catechism of the Catholic Church', 'Encyclopaedia Britannica, "Roman Catholicism"'],
  },
}
export default pack
