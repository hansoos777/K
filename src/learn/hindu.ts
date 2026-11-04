import type { LearnPack } from './types'

// 강의 본문: 사용자 제공 「실제 학습 본문 초안」(p1~p4) + 보강 강의. discover는 LEVEL 1 발견하기(질문형 짧은 글). 게시 전 전문가 검수 필요.
const pack: LearnPack = {
  "ko": {
    "title": "힌두교",
    "sub": "사나타나 다르마 · 영원한 길",
    "intro": "힌두교는 인도 아대륙에서 수천 년에 걸쳐 형성된 전통으로, 한 명의 창시자나 하나의 경전 대신 베다·우파니샤드 같은 오랜 경전과 다양한 지역 전통이 함께 이어져 왔습니다. 오늘날 약 12억 명이 믿으며, 같은 힌두교 안에서도 섬기는 신과 의례가 지역과 종파에 따라 크게 다릅니다.",
    "start": {
      "title": "처음 사원에 가 보기",
      "text": "사원을 고르고 들어가 합장·절·램프 밝히기까지 천천히 따라 해 보는 안내입니다.",
      "place": "mandir"
    },
    "lessons": [
      {
        "id": "p1",
        "title": "힌두교는 하나의 단일한 체계일까?",
        "goal": "힌두교 내부의 다양한 철학·신앙 전통을 이해한다.",
        "body": [
          "힌두교는 인도 아대륙에서 오랜 기간 형성된 종교·철학·의례 전통들의 폭넓은 이름이다. 특정한 한 창시자가 종교를 세웠다고 설명하기 어렵고, 하나의 중앙 조직이나 모든 신자가 공유하는 단일 신앙고백도 없다.",
          "힌두교에는 베다를 중요하게 여기는 의례 전통, 우파니샤드의 철학적 탐구, 비슈누·시바·여신을 중심으로 하는 신앙, 신에 대한 사랑과 헌신을 표현하는 박티 전통, 요가와 명상, 사원 의례와 가정 예배 등이 함께 존재한다.",
          "신을 이해하는 방식도 다양하다. 어떤 전통은 비슈누나 시바, 여신을 최고 신격으로 섬기고, 어떤 철학은 궁극적 실재인 브라만을 강조한다. 신격들은 독립된 신으로 이해되기도 하고 하나의 궁극적 실재가 드러나는 모습으로 해석되기도 한다. 모든 힌두교인에게 하나의 설명을 적용해서는 안 된다."
        ],
        "termDefs": [
          {
            "term": "베다",
            "def": "힌두교의 오래된 권위 문헌 전통."
          },
          {
            "term": "브라만",
            "def": "여러 힌두 철학에서 궁극적 실재를 가리키는 개념."
          },
          {
            "term": "박티",
            "def": "신격에 대한 사랑과 헌신의 길."
          },
          {
            "term": "다르샨",
            "def": "신성한 존재를 뵙고 바라보는 종교적 경험."
          }
        ],
        "summary": "힌두교는 오랜 기간 형성된 다양한 종교·철학 전통의 집합이며 내부 차이가 크다.",
        "think": "다양한 전통을 하나의 모습으로 단순화하지 않으려면 어떤 질문을 해야 할까?",
        "thinkGuide": "어느 지역의 전통인지, 어떤 신격을 중심으로 하는지(비슈누·시바·여신 등), 어떤 문헌과 철학 학파를 따르는지, 사원 의례인지 가정 예배인지를 묻는 것이 도움이 됩니다.",
        "level": "intro",
        "unit": "개요",
        "minutes": 3
      },
      {
        "id": "p2",
        "title": "카르마·윤회·목샤",
        "goal": "핵심 개념들의 관계와 해석 차이를 이해한다.",
        "body": [
          "힌두교의 여러 전통에서 카르마는 행위와 그 결과가 도덕적·인과적으로 연결된다는 개념이다. 단순히 운이 좋거나 나쁘다는 뜻이 아니다. 의도와 행위가 현재와 미래의 경험에 영향을 준다는 설명이며 전통에 따라 의례·윤리·지식·헌신의 의미가 다르게 강조된다.",
          "삼사라는 태어남과 죽음, 다시 태어남이 이어지는 윤회의 흐름이다. 인간의 삶은 한 번의 생으로 끝나지 않는다고 보는 전통에서 카르마는 다음 생의 조건과 연결된다. 불교도 윤회를 말하지만 영원한 자아의 존재 여부 등에서 힌두교 전통과 중요한 차이가 있다.",
          "목샤는 삼사라의 속박에서 벗어나는 해탈이다. 해탈에 이르는 길은 전통마다 다르게 설명된다. 지식의 길(즈냐나), 신에 대한 헌신의 길(박티), 결과에 집착하지 않는 행위의 길(카르마 요가), 명상과 수행의 길 등이 대표적이다. 바가바드 기타는 행위·의무·헌신·지혜·요가를 대화 형식으로 다룬다."
        ],
        "termDefs": [
          {
            "term": "카르마",
            "def": "의도와 행위, 그 결과의 인과적 관계."
          },
          {
            "term": "삼사라",
            "def": "태어남과 죽음이 이어지는 윤회의 흐름."
          },
          {
            "term": "목샤",
            "def": "윤회의 속박에서 벗어나는 해탈."
          },
          {
            "term": "다르마",
            "def": "의무·질서·가르침·삶의 길 등을 뜻하는 다층적 개념."
          }
        ],
        "summary": "카르마·삼사라·목샤는 행위와 윤회, 해탈을 연결해 이해하는 핵심 개념이다.",
        "think": "행동의 결과뿐 아니라 의도와 책임을 함께 생각한다면 무엇이 달라질까?",
        "thinkGuide": "결과만 보면 운이나 벌처럼 보이기 쉽지만, 의도와 책임을 함께 보면 지금의 선택이 앞으로를 만든다는 관점이 됩니다. 바가바드 기타는 결과에 집착하지 않고 해야 할 일을 하는 태도(카르마 요가)를 말합니다.",
        "level": "intro",
        "unit": "철학",
        "minutes": 3
      },
      {
        "id": "p3",
        "title": "브라만·아트만과 요가의 여러 길",
        "goal": "철학 개념과 요가의 폭넓은 의미를 이해한다.",
        "body": [
          "브라만은 여러 힌두 철학에서 세계의 궁극적 실재 또는 근원으로 논의된다. 아트만은 자아 또는 참된 자기와 관련된 개념이다. 우파니샤드와 베단타 철학은 브라만과 아트만의 관계를 깊이 탐구했다.",
          "아드바이타 베단타는 궁극적으로 아트만과 브라만의 비이원성을 강조한다. 비시슈타드바이타와 드바이타 등 다른 베단타 학파는 신과 영혼, 세계의 관계를 다르게 해석한다. 따라서 모든 힌두교가 자아와 신이 완전히 같다고 가르친다고 일반화하면 안 된다.",
          "요가는 현대 대중문화에서 자세와 호흡 운동으로 알려져 있지만, 고전적 요가 전통은 마음의 작용을 다스리고 통찰과 해탈을 추구하는 수행 체계이기도 하다. 파탄잘리의 요가 수트라는 요가의 실천과 마음 훈련을 설명하는 중요한 문헌이다.",
          "바가바드 기타 등에서는 카르마 요가(행위), 박티 요가(헌신), 즈냐나 요가(지혜) 등 여러 길을 설명한다. 실제 전통에서는 이 길들이 서로 배타적이기보다 함께 실천되기도 한다."
        ],
        "termDefs": [
          {
            "term": "아트만",
            "def": "자아 또는 참된 자기와 관련된 개념."
          },
          {
            "term": "브라만",
            "def": "궁극적 실재를 가리키는 철학적 개념."
          },
          {
            "term": "베단타",
            "def": "우파니샤드 등을 해석하는 힌두 철학 전통."
          },
          {
            "term": "카르마 요가",
            "def": "결과에 집착하지 않는 행위의 길."
          },
          {
            "term": "박티 요가",
            "def": "신에 대한 사랑과 헌신의 길."
          },
          {
            "term": "즈냐나 요가",
            "def": "지식과 통찰을 통한 수행의 길."
          }
        ],
        "summary": "요가는 운동을 넘어 윤리·명상·철학·해탈의 길을 포함하는 다양한 전통이다.",
        "think": "요가를 신체 운동으로만 이해할 때 놓치기 쉬운 철학적 의미는 무엇일까?",
        "thinkGuide": "고전 요가는 윤리적 계율(야마·니야마), 호흡과 감각의 조절, 집중과 명상을 거쳐 마음의 작용을 다스리고 해탈을 추구하는 체계입니다. 자세(아사나)는 그 가운데 한 부분입니다.",
        "level": "basic",
        "unit": "철학",
        "minutes": 3
      },
      {
        "id": "p4",
        "title": "신격과 푸자·아르티",
        "goal": "주요 신격과 힌두교 의례의 기본 의미를 이해한다.",
        "body": [
          "가네샤는 장애를 제거하고 새로운 시작을 돕는 신격으로 널리 숭배된다. 시바는 파괴와 재생, 수행과 우주적 힘 등 다양한 측면을 지닌다. 비슈누는 우주 질서를 보존하는 신격으로 이해되며 크리슈나와 라마는 비슈누의 아바타라로 숭배되는 전통이 널리 알려져 있다.",
          "락슈미는 풍요와 번영, 두르가와 칼리는 여신의 힘과 보호, 사라스와티는 지식과 예술, 하누만은 헌신과 용기, 무루간은 특히 남인도 전통에서 중요한 신격이다. 파르바티는 시바의 배우자이자 여신 전통의 중요한 모습으로 이해된다. 신격의 관계와 의미는 문헌과 지역·종파·사원 전통에 따라 다양하다.",
          "푸자는 신격에게 꽃·물·음식·향·빛 등을 봉헌하며 예배하는 의례다. 가정의 제단에서 거행되기도 하고 사원에서 사제와 공동체가 진행하기도 한다. 아르티는 등불이나 불빛을 신격 앞에서 돌리며 봉헌하는 의례다. 만트라는 반복해 읊는 신성한 음절이나 문구이며 자파는 만트라나 신의 이름을 반복해서 염송하는 수행이다.",
          "ORUVIA의 가상 푸자 경험은 실제 힌두교 전통을 존중해야 한다. 선택한 신격과 의례의 의미를 안내하고, 만트라의 발음과 사용 맥락을 설명한다. 하나의 절차가 모든 힌두교에 공통이라고 표현하지 않는다."
        ],
        "termDefs": [
          {
            "term": "가네샤",
            "def": "장애 제거와 새로운 시작과 관련해 널리 숭배되는 신격."
          },
          {
            "term": "아바타라",
            "def": "신격이 세상에 나타나는 현현 또는 화신."
          },
          {
            "term": "푸자",
            "def": "신격에게 봉헌하며 예배하는 의례."
          },
          {
            "term": "아르티",
            "def": "등불을 봉헌하며 신격을 공경하는 의례."
          },
          {
            "term": "만트라",
            "def": "수행과 의례에서 반복해 읊는 신성한 음절·문구."
          }
        ],
        "summary": "힌두교의 신격과 의례는 다양하며 지역·가족·종파 전통에 따라 의미와 절차가 달라진다.",
        "think": "디지털 공간에서 실제 종교 의례를 경험할 때 어떤 설명과 주의사항이 필요할까?",
        "thinkGuide": "선택한 신격과 의례의 의미, 실제 사원과 가정에서는 절차가 전통마다 다르다는 점, 만트라의 발음과 사용 맥락, 그리고 가상 체험이 실제 의례나 사제의 역할을 대신하지 않는다는 점을 함께 안내해야 합니다.",
        "level": "basic",
        "unit": "신앙과 의례",
        "place": "mandir",
        "minutes": 3
      },
      {
        "id": "mandir",
        "title": "사원(만디르)의 구조",
        "body": [
          "가장 안쪽의 작은 성소 가르바그리하(\"자궁의 방\")에 신상을 모십니다.",
          "그 위로 신의 산을 뜻하는 탑이 솟는데, 북인도 나가라 양식은 시카라, 남인도 드라비다 양식은 비마나라 부르고, 남인도 사원은 커다란 문탑(고푸람)으로도 유명합니다.",
          "신자들이 모이는 기둥 홀을 만다파라고 합니다."
        ],
        "level": "basic",
        "unit": "사원과 수행",
        "minutes": 3
      },
      {
        "id": "mantra",
        "title": "만트라와 바잔",
        "body": [
          "만트라는 정해진 소리와 말로 마음을 모으는 기도입니다. 가장 널리 알려진 것은 옴(ॐ)과 리그베다의 가야트리 만트라입니다.",
          "바잔은 신을 찬양하는 노래로, 함께 부르는 모임(키르탄)도 있습니다."
        ],
        "level": "basic",
        "unit": "사원과 수행",
        "minutes": 3
      }
    ],
    "etiquette": [
      "사원에 들어가기 전에 신발을 벗습니다.",
      "어깨와 무릎을 가리는 단정한 옷을 입습니다. 가죽 소지품을 삼가는 사원도 있습니다.",
      "들어설 때 종을 울려 왔음을 알리고, 합장하며 \"나마스테\"로 인사합니다.",
      "성소와 신상은 허락 없이 만지지 않고, 사진은 허용된 곳에서만 찍습니다.",
      "성소 둘레는 시계 방향(오른쪽 어깨가 안쪽)으로 돕니다.",
      "프라사드와 공물은 오른손으로 주고받습니다."
    ],
    "practice": [
      {
        "label": "사원 방문 · 다르샨",
        "place": "mandir",
        "text": "12신의 사원에 들어가 신을 마주하고 합장·절을 올립니다."
      },
      {
        "label": "램프 밝히기 · 찬가",
        "place": "mandir",
        "text": "사원 안에서 등불을 올리고 신의 찬가를 듣습니다."
      },
      {
        "label": "나의 신전 · 매일 푸자",
        "place": "shrine",
        "text": "나만의 신당을 꾸미고 매일 푸자를 드립니다."
      }
    ],
    "activities": [
      {
        "name": "푸자",
        "text": "신에게 꽃·물·향·음식을 올리며 공경하는 예배입니다.",
        "meaning": "신을 귀한 손님으로 맞이해 대접한다는 뜻을 담고 있습니다. 집의 작은 신단에서 매일 드리는 경우가 많습니다.",
        "steps": [
          "몸과 신단을 깨끗이 합니다.",
          "등잔(디야)과 향을 밝힙니다.",
          "꽃과 물, 과일 같은 공물을 올립니다.",
          "만트라를 외우거나 기도합니다.",
          "공물을 프라사드로 나누어 받습니다."
        ],
        "img": "shrine",
        "place": "shrine"
      },
      {
        "name": "아르티",
        "text": "불을 밝힌 등잔을 신상 앞에서 시계 방향으로 돌립니다.",
        "meaning": "빛으로 신을 공경하고 어둠(무지)을 걷어 낸다는 뜻이 있습니다. 노래와 종소리가 함께합니다.",
        "steps": [
          "기(ghee) 등잔에 불을 붙입니다.",
          "종을 울리며 신상 앞에서 등잔을 시계 방향으로 돌립니다.",
          "참여한 사람들은 두 손을 불 위에 가져갔다가 눈과 이마에 댑니다."
        ],
        "img": "mandir",
        "place": "mandir"
      },
      {
        "name": "만트라",
        "text": "신성한 소리나 구절을 반복해 외웁니다.",
        "meaning": "“옴”처럼 짧은 소리부터 가야트리 만트라 같은 구절까지 있으며, 108알 염주(자파 말라)로 횟수를 셉니다.",
        "steps": [
          "편안히 앉아 숨을 고릅니다.",
          "염주를 한 알씩 넘기며 만트라를 외웁니다.",
          "108번을 마치면 잠시 조용히 머뭅니다."
        ],
        "img": "mandir",
        "place": "mandir"
      },
      {
        "name": "명상",
        "text": "호흡과 마음을 고요히 하고 한 곳에 집중합니다.",
        "meaning": "요가 전통에서 디야나(명상)는 마음을 하나로 모아 참된 자신을 깨닫는 길로 여겨집니다.",
        "steps": [
          "척추를 곧게 하고 앉습니다.",
          "숨을 천천히 들이쉬고 내쉽니다.",
          "신의 모습, 등잔 불꽃, 또는 만트라 하나에 마음을 둡니다."
        ],
        "img": "shrine"
      },
      {
        "name": "아비셰카 (신상 봉헌 의례)",
        "text": "신상에 물·우유·꿀 등을 부어 씻기고 꽃으로 꾸밉니다.",
        "meaning": "신상을 정성껏 씻기고 꾸미는 일은 신을 섬기는 마음의 표현입니다. 사원에서는 사제(푸자리)가 진행합니다.",
        "steps": [
          "사제가 정해진 순서로 물과 우유 등을 붓습니다.",
          "신상을 새 옷과 꽃으로 꾸밉니다.",
          "참여자는 합장하고 지켜보며 기도합니다.",
          "마지막에 아르티를 올립니다."
        ],
        "img": "mandir",
        "place": "mandir"
      }
    ],
    "figures": [
      {
        "name": "가네샤",
        "text": "코끼리 머리의 신으로 장애를 없애 줍니다. 무엇을 시작할 때 가장 먼저 모십니다."
      },
      {
        "name": "시바",
        "text": "파괴와 재생의 신으로, 명상하는 수행자의 모습이나 춤추는 나타라자로 그려집니다."
      },
      {
        "name": "비슈누",
        "text": "세상을 지키고 유지하는 신입니다. 라마와 크리슈나는 그의 화신으로 여겨집니다."
      },
      {
        "name": "락슈미",
        "text": "풍요와 행운의 여신으로, 디왈리에 특히 모십니다."
      },
      {
        "name": "옴 (ॐ)",
        "text": "우주의 근본 소리로 여겨지며, 많은 만트라의 처음과 끝에 붙습니다."
      }
    ],
    "scriptures": [
      {
        "name": "베다",
        "text": "리그·사마·야주르·아타르바 베다. 가장 오래된 경전으로 찬가와 의례를 담고 있습니다."
      },
      {
        "name": "우파니샤드",
        "text": "베다의 끝부분으로 브라만(궁극의 실재)과 아트만(참된 자아)을 탐구합니다."
      },
      {
        "name": "바가바드 기타",
        "text": "마하바라타 속 크리슈나와 아르주나의 대화로, 의무(다르마)와 헌신을 가르칩니다."
      },
      {
        "name": "라마야나 · 마하바라타",
        "text": "두 대서사시로, 라마와 크리슈나의 이야기가 오늘날까지 축제와 예술로 이어집니다."
      }
    ],
    "symbols": [
      {
        "name": "신상(무르티)",
        "text": "신이 머무는 모습으로 모시며, 사원 가장 안쪽 성소(가르바그리하)에 있습니다."
      },
      {
        "name": "고푸람 · 시카라",
        "text": "남인도의 높은 문탑과 북인도의 성소 위 탑으로, 신의 산을 나타냅니다."
      },
      {
        "name": "디야",
        "text": "기름 등잔. 어둠을 걷는 빛으로 푸자와 디왈리에 밝힙니다."
      },
      {
        "name": "옴 (ॐ)",
        "text": "우주의 근본 소리로 여겨집니다."
      },
      {
        "name": "얀트라 · 만다라",
        "text": "우주와 신을 기하학 도형으로 나타낸 명상 도구입니다."
      }
    ],
    "culture": [
      {
        "name": "가정 신단",
        "text": "많은 가정에 작은 신단이 있어 매일 아침저녁 푸자를 드립니다."
      },
      {
        "name": "채식과 프라사드",
        "text": "많은 힌두교인이 채식을 하며, 신에게 올린 음식은 프라사드로 나눕니다."
      },
      {
        "name": "바잔과 키르탄",
        "text": "신을 찬양하는 노래로, 함께 부르며 헌신(박티)을 표현합니다."
      }
    ],
    "glossary": [
      {
        "term": "다르마",
        "original": "धर्म · dharma",
        "def": "우주의 질서이자 각자가 지켜야 할 바른 의무입니다."
      },
      {
        "term": "카르마",
        "original": "कर्म · karma",
        "def": "행위와 그 결과. 좋은 행위는 좋은 결과를 낳는다는 법칙입니다."
      },
      {
        "term": "목샤",
        "original": "मोक्ष · mokṣa",
        "def": "윤회에서 벗어나는 해방입니다."
      },
      {
        "term": "삼사라",
        "original": "संसार · saṃsāra",
        "def": "태어나고 죽기를 거듭하는 윤회입니다."
      },
      {
        "term": "아트만",
        "original": "आत्मन् · ātman",
        "def": "변하지 않는 참된 자아입니다."
      },
      {
        "term": "브라만",
        "original": "ब्रह्मन् · brahman",
        "def": "모든 것의 근원인 궁극의 실재입니다. 사제 계층(브라만)과는 다른 말입니다."
      },
      {
        "term": "박티",
        "original": "भक्ति · bhakti",
        "def": "신에 대한 사랑과 헌신의 길입니다."
      },
      {
        "term": "푸자",
        "original": "पूजा · pūjā",
        "def": "꽃·물·빛·음식을 올리는 예배입니다."
      }
    ],
    "faq": [
      {
        "q": "힌두교 사원에 갈 때 주의할 점은?",
        "a": "입구에서 신발을 벗고, 어깨와 무릎을 가리는 옷을 입습니다. 성소 안 신상은 만지지 않으며 사진은 허락된 곳에서만 찍습니다."
      },
      {
        "q": "힌두교에는 신이 몇이나 있나요?",
        "a": "수많은 신이 있지만, 많은 전통에서는 이들이 하나의 궁극적 실재(브라만)의 여러 모습이라고 이해합니다. 집안과 지역에 따라 주로 모시는 신이 다릅니다."
      },
      {
        "q": "프라사드를 받으면 어떻게 하나요?",
        "a": "오른손으로 공손히 받아 먹습니다. 신의 축복이 담긴 음식이라 버리지 않습니다."
      }
    ],
    "quiz": [
      {
        "q": "무엇을 시작할 때 가장 먼저 모시는 신은?",
        "options": [
          "가네샤",
          "시바",
          "락슈미"
        ],
        "answer": 0,
        "explain": "가네샤는 장애를 없애는 신이라 가장 먼저 모십니다.",
        "lesson": "p4"
      },
      {
        "q": "바가바드 기타는 마하바라타의 일부이다.",
        "options": [
          "O",
          "X"
        ],
        "answer": 0,
        "explain": "크리슈나와 아르주나의 대화로 마하바라타 속에 있습니다.",
        "lesson": "p3"
      },
      {
        "q": "윤회에서 벗어나는 해방을 뜻하는 말은?",
        "options": [
          "목샤",
          "카르마",
          "다르마"
        ],
        "answer": 0,
        "explain": "목샤는 삼사라(윤회)에서의 해방입니다.",
        "lesson": "p2"
      },
      {
        "q": "사원 안에서는 신발을 신고 다녀도 된다.",
        "options": [
          "O",
          "X"
        ],
        "answer": 1,
        "explain": "입구에서 신발을 벗습니다.",
        "lesson": "mandir"
      }
    ],
    "status": "checking",
    "festivals": [
      {
        "name": "디왈리",
        "when": "10~11월",
        "text": "빛의 축제. 집집마다 디야를 밝히고 락슈미를 모십니다."
      },
      {
        "name": "홀리",
        "when": "3월",
        "text": "봄을 맞아 색 가루를 뿌리며 함께 즐깁니다."
      },
      {
        "name": "나바라트리 · 두르가 푸자",
        "when": "9~10월",
        "text": "아홉 밤 동안 여신을 섬깁니다."
      },
      {
        "name": "가네샤 차투르티",
        "when": "8~9월",
        "text": "가네샤의 탄생을 기념합니다."
      },
      {
        "name": "마하 시바라트리",
        "when": "2~3월",
        "text": "시바를 기리며 밤새 기도합니다."
      },
      {
        "name": "크리슈나 잔마슈타미",
        "when": "8~9월",
        "text": "크리슈나의 탄생을 기념합니다."
      }
    ],
    "festivalNote": "힌두 축제는 음력·태양력을 함께 쓰는 달력을 따르므로 날짜가 해마다 바뀝니다. 정확한 날짜는 힌두교 사원의 축제 일정에서 볼 수 있어요.",
    "sources": [
      "Encyclopaedia Britannica, \"Hinduism\"",
      "한국민족문화대백과사전 · 두산백과의 힌두교 항목",
      "힌두교 사원 축제·신 자료"
    ],
    "discover": [
      {
        "q": "힌두교에는 왜 다양한 신이 있을까요?",
        "a": "오랜 세월 여러 지역의 전통이 함께 자라 왔기 때문이에요. 많은 전통에서는 여러 신을 하나의 궁극적 실재(브라만)가 드러난 여러 모습으로 이해하기도 해요.",
        "lesson": "p1",
        "place": "mandir"
      },
      {
        "q": "가네샤는 어떤 신일까요?",
        "a": "코끼리 머리를 한 신으로, 장애를 없애고 새로운 시작을 돕는다고 여겨져요. 그래서 무엇을 시작할 때 가장 먼저 모셔요.",
        "lesson": "p4",
        "place": "mandir"
      },
      {
        "q": "아르티는 어떤 의식일까요?",
        "a": "불을 밝힌 등잔을 신상 앞에서 시계 방향으로 돌리며 빛으로 신을 공경하는 의식이에요. 노래와 종소리가 함께해요.",
        "lesson": "p4",
        "place": "mandir"
      },
      {
        "q": "힌두 사원은 왜 화려하게 장식되어 있을까요?",
        "a": "사원은 신이 머무는 집으로 여겨져요. 높은 탑과 조각, 꽃과 등불로 꾸며 신을 귀한 손님처럼 맞이하는 마음을 표현해요.",
        "lesson": "mandir",
        "place": "mandir"
      }
    ]
  },
  "en": {
    "title": "Hinduism",
    "sub": "Sanatana Dharma · the eternal way",
    "intro": "Hinduism took shape over thousands of years in the Indian subcontinent. Instead of one founder or one book, it carries ancient scriptures such as the Vedas and Upanishads together with many regional traditions. About 1.2 billion people follow it today, and deities and rites vary widely by region and tradition.",
    "start": {
      "title": "Your first temple visit",
      "text": "Choose a temple, enter, greet, bow and light a lamp, step by step.",
      "place": "mandir"
    },
    "lessons": [
      {
        "id": "what",
        "title": "What is Hinduism",
        "body": [
          "Key ideas include Brahman (the ultimate reality), samsara (the cycle of rebirth), karma and moksha (liberation).",
          "The Vedas, Upanishads, the epics Ramayana and Mahabharata, and the Bhagavad Gita are widely read."
        ]
      },
      {
        "id": "deities",
        "title": "Major deities",
        "body": [
          "Brahma, Vishnu and Shiva (the Trimurti) create, preserve and dissolve.",
          "Ganesha, remover of obstacles, is honoured first. Lakshmi (prosperity), Saraswati (wisdom and arts), Durga and Kali (who defeat evil) and Hanuman (devotion and strength) are widely worshipped.",
          "Rama and Krishna are revered as avatars of Vishnu.",
          "Which deity is held supreme differs between traditions (Vaishnava, Shaiva, Shakta and others)."
        ]
      },
      {
        "id": "mandir",
        "title": "The mandir",
        "body": [
          "The deity rests in the small inner sanctum, the garbhagriha (\"womb chamber\").",
          "Above it rises a tower evoking the mountain of the gods: the shikhara in the northern Nagara style, the vimana in the southern Dravida style, where huge gate towers (gopurams) are also famous.",
          "Devotees gather in the pillared mandapa."
        ]
      },
      {
        "id": "puja",
        "title": "Puja and aarti",
        "body": [
          "In puja the deity is welcomed like an honoured guest with water, flowers, incense, light and food. Offered food is shared as prasad, carrying the blessing.",
          "Aarti is waving a lamp clockwise before the deity while singing, usually at the end of puja.",
          "Seeing and being seen by the deity is darshan, the heart of a temple visit."
        ]
      },
      {
        "id": "mantra",
        "title": "Mantra and bhajan",
        "body": [
          "A mantra gathers the mind with set sounds and words. Om and the Gayatri mantra of the Rigveda are best known.",
          "Bhajans are devotional songs, also sung together in kirtan."
        ]
      }
    ],
    "etiquette": [
      "Remove your shoes before entering.",
      "Dress modestly, covering shoulders and knees. Some temples ask visitors to avoid leather.",
      "Ring the bell as you enter and greet with joined palms: \"Namaste\".",
      "Do not touch the sanctum or deity without permission; photograph only where allowed.",
      "Walk around the sanctum clockwise.",
      "Give and receive prasad and offerings with the right hand."
    ],
    "practice": [
      {
        "label": "Temple visit · darshan",
        "place": "mandir",
        "text": "Enter the temples of 12 deities and greet them."
      },
      {
        "label": "Lamps · songs",
        "place": "mandir",
        "text": "Offer a lamp and hear devotional songs inside."
      },
      {
        "label": "My Shrine · Daily Puja",
        "place": "shrine",
        "text": "Keep your own shrine and daily puja."
      }
    ],
    "activities": [
      {
        "name": "Puja",
        "text": "Honouring a deity with flowers, water, incense and food.",
        "meaning": "The deity is welcomed and served as an honoured guest, often daily at a small home shrine.",
        "steps": [
          "Clean yourself and the shrine.",
          "Light the lamp (diya) and incense.",
          "Offer flowers, water and fruit.",
          "Chant a mantra or pray.",
          "Receive the offering back as prasad."
        ],
        "img": "shrine",
        "place": "shrine"
      },
      {
        "name": "Aarti",
        "text": "Circling a lit lamp clockwise before the deity.",
        "meaning": "Honouring the deity with light that removes darkness (ignorance), with song and bells.",
        "steps": [
          "Light the ghee lamp.",
          "Ring the bell and circle the lamp clockwise before the image.",
          "Pass your hands over the flame and touch your eyes and forehead."
        ],
        "img": "mandir",
        "place": "mandir"
      },
      {
        "name": "Mantra",
        "text": "Repeating a sacred sound or verse.",
        "meaning": "From the single sound “Om” to verses like the Gayatri Mantra, often counted on a 108-bead japa mala.",
        "steps": [
          "Sit comfortably and settle the breath.",
          "Move one bead per repetition.",
          "After 108, sit quietly for a moment."
        ],
        "img": "mandir",
        "place": "mandir"
      },
      {
        "name": "Meditation",
        "text": "Calming breath and mind and focusing on one point.",
        "meaning": "In yoga traditions dhyana gathers the mind to realise the true self.",
        "steps": [
          "Sit with a straight spine.",
          "Breathe in and out slowly.",
          "Rest the mind on a deity, a lamp flame or one mantra."
        ],
        "img": "shrine"
      },
      {
        "name": "Abhisheka",
        "text": "Bathing the deity with water, milk and honey and adorning it with flowers.",
        "meaning": "Washing and dressing the image expresses devotion; in temples a priest (pujari) leads it.",
        "steps": [
          "The priest pours water, milk and more in set order.",
          "The image is dressed in new cloth and flowers.",
          "Devotees watch with joined palms in prayer.",
          "Aarti is offered at the end."
        ],
        "img": "mandir",
        "place": "mandir"
      }
    ],
    "figures": [
      {
        "name": "Ganesha",
        "text": "The elephant-headed remover of obstacles, honoured first at any beginning."
      },
      {
        "name": "Shiva",
        "text": "God of destruction and renewal, shown as a meditating ascetic or the dancing Nataraja."
      },
      {
        "name": "Vishnu",
        "text": "Preserver of the world; Rama and Krishna are held to be his avatars."
      },
      {
        "name": "Lakshmi",
        "text": "Goddess of prosperity and good fortune, honoured especially at Diwali."
      },
      {
        "name": "Om (ॐ)",
        "text": "The primordial sound, placed at the start and end of many mantras."
      }
    ],
    "scriptures": [
      {
        "name": "The Vedas",
        "text": "Rig, Sama, Yajur and Atharva: the oldest scriptures, with hymns and rituals."
      },
      {
        "name": "The Upanishads",
        "text": "The closing part of the Vedas, exploring Brahman (ultimate reality) and Atman (true self)."
      },
      {
        "name": "The Bhagavad Gita",
        "text": "Krishna’s dialogue with Arjuna in the Mahabharata, on duty (dharma) and devotion."
      },
      {
        "name": "Ramayana and Mahabharata",
        "text": "The two great epics; the stories of Rama and Krishna live on in festivals and art."
      }
    ],
    "symbols": [
      {
        "name": "The murti",
        "text": "The image in which the deity is honoured, in the innermost sanctum (garbhagriha)."
      },
      {
        "name": "Gopuram and shikhara",
        "text": "The tall gate towers of the south and the sanctum towers of the north, evoking the mountain of the gods."
      },
      {
        "name": "The diya",
        "text": "An oil lamp, light that removes darkness, lit at puja and Diwali."
      },
      {
        "name": "Om (ॐ)",
        "text": "Held to be the primordial sound."
      },
      {
        "name": "Yantra and mandala",
        "text": "Geometric forms of the cosmos and the divine, used in meditation."
      }
    ],
    "culture": [
      {
        "name": "Home shrines",
        "text": "Many homes keep a small shrine for morning and evening puja."
      },
      {
        "name": "Vegetarian food and prasad",
        "text": "Many Hindus are vegetarian; food offered to the deity is shared as prasad."
      },
      {
        "name": "Bhajan and kirtan",
        "text": "Devotional songs sung together as an expression of bhakti."
      }
    ],
    "glossary": [
      {
        "term": "Dharma",
        "original": "धर्म",
        "def": "Cosmic order and one’s rightful duty."
      },
      {
        "term": "Karma",
        "original": "कर्म",
        "def": "Action and its consequences."
      },
      {
        "term": "Moksha",
        "original": "मोक्ष",
        "def": "Liberation from the cycle of rebirth."
      },
      {
        "term": "Samsara",
        "original": "संसार",
        "def": "The cycle of birth and death."
      },
      {
        "term": "Atman",
        "original": "आत्मन्",
        "def": "The unchanging true self."
      },
      {
        "term": "Brahman",
        "original": "ब्रह्मन्",
        "def": "The ultimate reality behind all things; different from the priestly class (Brahmin)."
      },
      {
        "term": "Bhakti",
        "original": "भक्ति",
        "def": "The path of loving devotion to God."
      },
      {
        "term": "Puja",
        "original": "पूजा",
        "def": "Worship with flowers, water, light and food."
      }
    ],
    "faq": [
      {
        "q": "What should I know before visiting a Hindu temple?",
        "a": "Remove your shoes at the entrance and cover shoulders and knees. Do not touch images in the sanctum, and photograph only where allowed."
      },
      {
        "q": "How many gods are there in Hinduism?",
        "a": "There are many, but many traditions understand them as forms of one ultimate reality (Brahman). Families and regions honour different deities."
      },
      {
        "q": "What do I do with prasad?",
        "a": "Receive it respectfully with the right hand and eat it; it carries the deity’s blessing and is not thrown away."
      }
    ],
    "quiz": [
      {
        "q": "Which deity is honoured first at any beginning?",
        "options": [
          "Ganesha",
          "Shiva",
          "Lakshmi"
        ],
        "answer": 0,
        "explain": "Ganesha removes obstacles, so is honoured first.",
        "lesson": "deities"
      },
      {
        "q": "The Bhagavad Gita is part of the Mahabharata.",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explain": "It is Krishna’s dialogue with Arjuna within the epic.",
        "lesson": "what"
      },
      {
        "q": "Which word means liberation from rebirth?",
        "options": [
          "Moksha",
          "Karma",
          "Dharma"
        ],
        "answer": 0,
        "explain": "Moksha is liberation from samsara.",
        "lesson": "what"
      },
      {
        "q": "Shoes may be worn inside the temple.",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explain": "Shoes are removed at the entrance.",
        "lesson": "mandir"
      }
    ],
    "status": "checking",
    "festivals": [
      {
        "name": "Diwali",
        "when": "Oct–Nov",
        "text": "Festival of lights; lamps are lit and Lakshmi is worshipped."
      },
      {
        "name": "Holi",
        "when": "March",
        "text": "Spring festival of colours."
      },
      {
        "name": "Navaratri · Durga Puja",
        "when": "Sep–Oct",
        "text": "Nine nights honouring the Goddess."
      },
      {
        "name": "Ganesh Chaturthi",
        "when": "Aug–Sep",
        "text": "Celebrates the birth of Ganesha."
      },
      {
        "name": "Maha Shivaratri",
        "when": "Feb–Mar",
        "text": "A night of prayer to Shiva."
      },
      {
        "name": "Krishna Janmashtami",
        "when": "Aug–Sep",
        "text": "Celebrates the birth of Krishna."
      }
    ],
    "festivalNote": "Hindu festivals follow a lunisolar calendar, so dates change every year. See the festival schedule in the Hindu temples for exact dates.",
    "sources": [
      "Encyclopaedia Britannica, \"Hinduism\"",
      "Encyclopedia of Korean Culture · Doopedia entries on Hinduism",
      "Hindu temple festival and deity data"
    ],
    "discover": [
      {
        "q": "Why are there so many gods in Hinduism?",
        "a": "Many regional traditions grew together over centuries; many understand the gods as forms of one ultimate reality, Brahman.",
        "lesson": "what",
        "place": "mandir"
      },
      {
        "q": "Who is Ganesha?",
        "a": "The elephant-headed god who removes obstacles and blesses beginnings, so he is honoured first.",
        "lesson": "deities",
        "place": "mandir"
      },
      {
        "q": "What is aarti?",
        "a": "A lit lamp is circled clockwise before the deity, honouring the divine with light, with songs and bells.",
        "lesson": "puja",
        "place": "mandir"
      },
      {
        "q": "Why are Hindu temples so richly decorated?",
        "a": "A temple is the deity’s home; towers, carvings, flowers and lamps welcome the deity as an honoured guest.",
        "lesson": "mandir",
        "place": "mandir"
      }
    ]
  }
}

export default pack
