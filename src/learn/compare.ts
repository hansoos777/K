/**
 * 종교 간 비교 학습. 이해를 돕기 위한 것이며 우열·진위를 가리지 않는다.
 * 종교 안에서도 해석이 여럿이라는 점을 note에 적는다.
 */
export interface CompareTopic { id: string; title: string; items: Record<'christian' | 'catholic' | 'temple' | 'mandir', string>; note: string }

const ko: CompareTopic[] = [
  { id: 'after', title: '죽음 이후의 세계', items: {
    christian: '예수를 믿는 이는 부활과 영생을 얻는다고 믿습니다. 마지막 날 그리스도가 다시 오시고 심판이 있으며, 천국과 지옥을 말합니다.',
    catholic: '죽은 뒤 개별 심판을 받고 천국·연옥·지옥을 말합니다. 연옥은 천국에 들기 전 정화되는 상태이며, 세상 끝에 몸의 부활이 있다고 믿습니다.',
    temple: '업(행위)에 따라 다시 태어나는 윤회를 말하며, 탐욕·성냄·어리석음이 사라진 열반에 이르면 윤회에서 벗어난다고 가르칩니다.',
    mandir: '아트만(참된 자아)은 카르마에 따라 삼사라(윤회)를 거듭하며, 목샤(해방)에 이르면 윤회에서 벗어난다고 봅니다.',
  }, note: '같은 종교 안에서도 교파·종파에 따라 설명이 다릅니다.' },
  // 사용자 제공 원고 「종교 비교 학습 샘플: 고통과 삶의 변화」
  { id: 'suffering', title: '고통과 삶의 변화', items: {
    christian: '기독교 전통은 고통을 인간의 유한성, 불의, 관계의 상처 등 여러 관점에서 다루며 하나님과 이웃의 사랑, 희망, 위로, 정의와 돌봄을 강조합니다.',
    catholic: '기독교 전통의 관점을 함께 지니면서, 성사와 전례, 교회의 공동체적 돌봄을 연결해 고통을 설명할 수 있습니다.',
    temple: '고(苦)를 삶의 조건과 집착, 무지의 문제로 분석하고, 사성제와 팔정도를 통해 괴로움의 원인을 이해하고 소멸로 나아가는 길을 제시합니다.',
    mandir: '여러 전통이 카르마와 다르마, 삼사라, 목샤를 통해 행위와 삶의 질서, 윤회와 해탈을 설명합니다. 박티 전통에서는 신에 대한 헌신과 은총도 중요한 길로 다뤄집니다.',
  }, note: '네 전통 모두 고통을 다룬다고 해서 원인과 해결 방법이 같다는 뜻은 아닙니다. 공통 주제를 찾되 각 전통의 고유 개념과 역사적 배경을 보존합니다.' },
  { id: 'prayer', title: '기도와 명상', items: {
    christian: '하나님께 말하는 대화로서의 기도가 중심이며, 말씀을 곱씹는 묵상을 합니다.',
    catholic: '미사와 성무일도 같은 공적 기도, 묵주기도·성체 조배 같은 개인 기도, 렉시오 디비나와 관상 기도가 있습니다.',
    temple: '참선·호흡 명상으로 마음을 살피고, 예불·염불·절로 부처님께 예를 올립니다.',
    mandir: '푸자와 아르티로 신을 공경하고, 만트라를 외우며(자파), 요가 전통의 명상(디야나)을 합니다.',
  }, note: '' },
  { id: 'scripture', title: '경전', items: {
    christian: '구약 39권과 신약 27권, 66권의 성경.',
    catholic: '제2경전을 포함한 73권의 성경과 성전(전승), 교회의 가르침.',
    temple: '팔리 삼장과 대승 경전(반야심경·금강경·법화경 등). 정해진 한 권의 경전이 아니라 방대한 경전 모음입니다.',
    mandir: '베다와 우파니샤드(계시서), 라마야나·마하바라타·바가바드 기타·푸라나(전승서).',
  }, note: '' },
]
const en: CompareTopic[] = [
  { id: 'after', title: 'Life after death', items: {
    christian: 'Those who believe in Jesus receive resurrection and eternal life; Christ will return, there will be judgement, heaven and hell.',
    catholic: 'Particular judgement after death; heaven, purgatory (a purification before heaven) and hell, and the resurrection of the body at the end.',
    temple: 'Rebirth according to karma; nirvana, the ending of greed, anger and delusion, frees one from the cycle.',
    mandir: 'The atman passes through samsara according to karma; moksha is liberation from it.',
  }, note: 'Explanations differ between denominations and schools within each faith.' },
  { id: 'suffering', title: 'Suffering, salvation and liberation', items: {
    christian: 'The root is separation from God (sin); salvation is by grace through faith in Christ’s cross and resurrection.',
    catholic: 'Salvation through Christ; grace comes through the sacraments, especially baptism and the Eucharist, with faith working through love.',
    temple: 'Suffering arises from craving (the Four Noble Truths) and can be ended through the Eightfold Path.',
    mandir: 'Ignorance and karma bind to rebirth; the paths of knowledge, action, devotion and meditation lead to liberation.',
  }, note: '“Salvation” and “liberation” are different ideas and are not treated as the same.' },
  { id: 'prayer', title: 'Prayer and meditation', items: {
    christian: 'Prayer as conversation with God, and meditation on Scripture.',
    catholic: 'Public prayer (Mass, the Liturgy of the Hours), personal prayer (Rosary, adoration), lectio divina and contemplation.',
    temple: 'Seon and breath meditation to see the mind; services, chanting and bows to honour the Buddha.',
    mandir: 'Puja and aarti, mantra repetition (japa) and meditation (dhyana).',
  }, note: '' },
  { id: 'scripture', title: 'Scriptures', items: {
    christian: 'The 66 books of the Bible: 39 Old Testament, 27 New.',
    catholic: 'The 73-book Bible including the deuterocanon, with Tradition and Church teaching.',
    temple: 'The Pali Canon and Mahayana sutras (Heart, Diamond, Lotus); a large collection rather than one book.',
    mandir: 'The Vedas and Upanishads (shruti) and the epics, Gita and Puranas (smriti).',
  }, note: '' },
]
export default { ko, en }
