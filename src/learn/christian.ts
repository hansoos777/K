import type { LearnPack } from './types'

// 강의 본문: 사용자 제공 「실제 학습 본문 초안」(p1~p4) + 보강 강의. discover는 LEVEL 1 발견하기(질문형 짧은 글). 게시 전 전문가 검수 필요.
const pack: LearnPack = {
  "ko": {
    "title": "기독교 (개신교)",
    "sub": "말씀과 은혜 · 예수 그리스도",
    "intro": "기독교는 1세기 팔레스타인에서 살았던 예수 그리스도의 삶과 가르침, 십자가의 죽음과 부활을 믿는 종교입니다. 개신교는 1517년 마르틴 루터에서 시작된 종교개혁에서 갈라져 나왔으며, 한국에는 1885년 아펜젤러와 언더우드 선교사의 입국을 기점으로 널리 퍼졌습니다.",
    "start": {
      "title": "처음 교회에 가 보기",
      "text": "교회에 들어가 자리에 앉고, 강단과 오르간을 둘러보며 예배의 흐름을 배우는 안내입니다.",
      "place": "traditional"
    },
    "lessons": [
      {
        "id": "p1",
        "title": "기독교의 시작과 예수",
        "goal": "기독교의 역사적 출발과 초기 공동체 형성을 설명한다.",
        "body": [
          "기독교는 1세기 로마 제국 지배 아래 있던 유대 지역에서 시작되었다. 예수는 유대교 전통 안에서 활동한 유대인이었으며 하나님 나라를 선포하고 비유와 가르침을 통해 회개, 사랑, 용서, 이웃에 대한 책임을 강조했다.",
          "기독교 신앙의 중심에는 예수의 십자가 처형과 부활에 대한 믿음이 있다. 복음서는 예수의 삶과 가르침, 죽음과 부활을 서로 다른 관점과 강조점으로 전한다. 십자가는 고난과 희생, 죄와 구원에 대한 해석의 중심이며 부활은 죽음이 최종 결론이 아니라는 희망을 나타낸다.",
          "예수 사후 제자들은 부활을 믿고 그 소식을 전했다. 초기 공동체는 예루살렘을 넘어 지중해 세계로 확산되었다. 바울은 여러 지역을 여행하며 비유대인에게도 복음이 전해질 수 있다고 주장했고, 그의 편지는 초기 교회의 믿음과 갈등을 이해하는 중요한 자료가 되었다. 개신교는 16세기 종교개혁과 그 이후의 여러 운동에서 발전한 기독교 전통이다."
        ],
        "termDefs": [
          {
            "term": "복음",
            "def": "예수 그리스도를 통한 구원의 좋은 소식."
          },
          {
            "term": "복음서",
            "def": "예수의 생애와 가르침을 전하는 신약의 네 문헌."
          },
          {
            "term": "사도",
            "def": "초기 기독교에서 예수의 메시지를 전한 사명자."
          }
        ],
        "summary": "기독교는 1세기 유대 지역에서 시작되었고, 예수의 삶·죽음·부활에 대한 믿음을 중심으로 확산되었다.",
        "think": "예수의 가르침 중 사랑과 이웃에 대한 책임은 오늘날 어떻게 실천될 수 있을까?",
        "thinkGuide": "예를 들어 가까운 사람을 먼저 용서하기, 어려운 이웃을 돕는 봉사, 차별받는 사람의 편에 서기 등을 떠올릴 수 있습니다. 많은 교회는 이것을 '믿음의 열매'로 설명합니다. 종교가 없어도 함께 생각해 볼 수 있는 질문입니다.",
        "level": "intro",
        "unit": "역사",
        "place": "traditional",
        "minutes": 3
      },
      {
        "id": "p2",
        "title": "성경의 구조와 읽는 방법",
        "goal": "구약·신약의 구조와 문학 장르의 차이를 이해한다.",
        "body": [
          "성경은 한 사람이 한 번에 쓴 단일 책이 아니라 오랜 기간 여러 저자와 공동체를 통해 기록·편집·전승된 문헌들의 모음이다. 크게 구약과 신약으로 나뉜다. 구약은 이스라엘의 역사와 신앙, 율법, 시와 지혜, 예언 전통을 담고 있고 신약은 예수와 초기 기독교 공동체에 관한 문헌을 담는다.",
          "개신교 성경은 일반적으로 구약 39권과 신약 27권, 총 66권이다. 천주교 성경은 제2경전으로 불리는 문헌들을 포함하므로 권수와 배열이 다르다. 권수나 목록을 설명할 때는 어떤 교회의 정경 기준인지 밝혀야 한다.",
          "성경에는 역사 서술, 법률, 시, 지혜 문학, 예언, 복음서, 편지, 묵시 문학 등 여러 장르가 있다. 시편의 시적 표현을 법률 문장처럼 읽거나 비유를 문자 그대로의 역사 기록처럼 읽으면 오해가 생길 수 있다. 초보자는 창세기, 출애굽기, 시편, 복음서, 사도행전을 차례로 읽으며 등장인물과 시대 배경을 기록해 볼 수 있다."
        ],
        "termDefs": [
          {
            "term": "정경",
            "def": "종교 공동체가 권위 있는 경전으로 인정한 문헌 목록."
          },
          {
            "term": "구약",
            "def": "기독교 성경의 앞부분에 해당하는 이스라엘 경전 전통."
          },
          {
            "term": "신약",
            "def": "예수와 초기 기독교 공동체에 관한 문헌 모음."
          }
        ],
        "summary": "성경은 다양한 장르로 이루어져 있으므로 문맥·역사적 배경·정경 전통을 함께 살펴야 한다.",
        "think": "성경의 한 구절을 읽을 때 앞뒤 문단과 당시 독자를 살펴야 하는 이유는?",
        "thinkGuide": "한 구절만 떼어 읽으면 시(詩)를 법처럼, 비유를 역사 기록처럼 읽는 오해가 생길 수 있습니다. 누가 누구에게 어떤 상황에서 쓴 글인지 보면, 같은 문장도 위로인지 경고인지 뜻이 분명해집니다.",
        "level": "intro",
        "unit": "성경",
        "minutes": 3
      },
      {
        "id": "p3",
        "title": "하나님·삼위일체·구원",
        "goal": "주요 기독교 교리의 기초 개념을 이해한다.",
        "body": [
          "기독교는 한 분 하나님을 믿는 유일신 전통이다. 주류 기독교 교리에서 하나님은 성부·성자·성령의 삼위로 이해된다. 삼위일체는 세 신이 있다는 뜻이 아니라 한 하나님 안에 구별되는 세 위격이 있다는 교리다. 이 교리는 초기 교회의 성경 해석과 신학 논쟁, 공의회의 논의를 거쳐 정교화되었다.",
          "주류 교리는 예수를 참 하나님이자 참 인간으로 고백한다. 성령은 하나님의 임재와 활동을 나타내며 신자와 공동체를 이끄는 분으로 설명된다. 교파에 따라 교리를 설명하는 표현과 강조점에는 차이가 있다.",
          "구원은 죄와 하나님과의 단절에서 회복되는 것을 가리킨다. 은혜는 회복이 인간의 공로만으로 얻어지는 것이 아니라 하나님의 선물이라는 점을 강조한다. 개신교 전통 안에서도 믿음과 행위, 성화와 구원의 과정에 대한 설명은 서로 다르다. 사랑은 예배와 신앙고백에 머무르지 않고 용서·정의·돌봄·나눔으로 이어져야 한다고 가르친다."
        ],
        "termDefs": [
          {
            "term": "삼위일체",
            "def": "한 하나님을 성부·성자·성령의 세 위격으로 이해하는 교리."
          },
          {
            "term": "은혜",
            "def": "인간의 공로가 아니라 하나님의 선물로 주어지는 호의와 도움."
          },
          {
            "term": "성화",
            "def": "신앙 안에서 삶과 성품이 변화되어 가는 과정."
          }
        ],
        "summary": "삼위일체·은혜·구원은 기독교의 핵심 개념이며 교파별 설명의 차이를 함께 살펴야 한다.",
        "think": "신앙의 고백과 실제 삶의 변화는 어떻게 연결될 수 있을까?",
        "thinkGuide": "개신교에서는 고백(믿음)이 삶의 변화(성화)로 이어진다고 설명합니다. 다만 그 과정을 얼마나 단계적으로 보는지는 교파마다 다릅니다. 말과 행동, 관계에서 무엇이 달라졌는지를 돌아보는 질문으로 생각해 볼 수 있습니다.",
        "level": "basic",
        "unit": "교리",
        "minutes": 3
      },
      {
        "id": "p4",
        "title": "예배와 교회 생활",
        "goal": "예배의 일반 요소와 교회 공동체의 역할을 이해한다.",
        "body": [
          "개신교 예배에는 찬송, 기도, 성경 봉독, 설교, 헌금, 축도 등이 포함될 수 있지만 교단과 교회에 따라 순서와 강조점은 다르다. 어떤 공동체는 전통적인 예전과 성찬을 중요하게 여기고, 다른 공동체는 찬양과 설교를 중심으로 예배를 구성한다.",
          "설교는 성경 본문을 해석해 오늘의 삶과 연결하는 가르침이다. 성찬은 예수의 최후의 만찬을 기억하고 그의 죽음과 부활을 기념하는 의례다. 세례는 기독교 공동체에 들어오는 표지로 이해되며, 시행 방식과 유아세례에 대한 견해는 교파별로 다르다.",
          "교회는 예배 장소이면서 교육·돌봄·봉사·친교가 이루어지는 공동체다. 주일학교, 성경 공부, 소그룹, 지역 봉사와 구제 활동 등이 교회 생활의 일부가 될 수 있다. 방문자는 촬영과 이동, 성찬 참여에 관한 교회의 안내를 존중해야 한다."
        ],
        "termDefs": [
          {
            "term": "설교",
            "def": "성경 본문을 해석해 공동체에 전하는 가르침."
          },
          {
            "term": "세례",
            "def": "물을 사용하는 기독교 입문 의례."
          },
          {
            "term": "성찬",
            "def": "예수의 최후의 만찬을 기념하는 의례."
          }
        ],
        "summary": "개신교 예배와 교회 생활은 교파별 차이가 있으며 공동체·교육·돌봄 활동을 포함한다.",
        "think": "종교 공간을 처음 방문하는 사람을 위해 어떤 안내가 필요할까?",
        "thinkGuide": "예배 시간과 대략의 순서, 앉아도 되는 자리, 일어서는 때, 성찬 참여 기준(처음이면 지켜보기만 해도 됨), 헌금은 자유라는 점, 촬영 가능 여부, 처음 왔을 때 말을 걸 사람(안내위원) 등이 도움이 됩니다.",
        "level": "basic",
        "unit": "신앙생활",
        "place": "traditional",
        "minutes": 3
      },
      {
        "id": "space",
        "title": "교회의 공간",
        "body": [
          "강단(강대상)은 말씀을 전하는 곳으로 예배당의 중심에 있습니다.",
          "십자가는 예수의 죽음과 부활을 기억하는 상징이며, 개신교 교회에는 보통 예수상이 없는 빈 십자가를 둡니다."
        ],
        "level": "basic",
        "unit": "공간",
        "minutes": 3
      },
      {
        "id": "israel",
        "title": "고대 이스라엘과 유대교의 배경",
        "unit": "역사",
        "level": "basic",
        "goal": "기독교가 어떤 신앙 전통 위에서 시작되었는지 이해합니다.",
        "body": [
          "기독교는 고대 이스라엘의 신앙에서 자라났습니다. 이스라엘 사람들은 한 분 하나님(야훼)이 세상을 창조하고, 아브라함과 그 후손을 택해 언약을 맺었다고 믿었습니다.",
          "모세를 통해 받은 율법(토라), 다윗 왕조, 예언자들의 메시지, 바빌론 포로 생활과 귀환의 역사는 히브리 성경(기독교의 구약)에 기록되어 있습니다.",
          "예언자들은 하나님이 보내실 구원자, 곧 메시아(“기름 부음 받은 자”)를 기다리게 했습니다. 기독교는 예수가 바로 그 메시아(그리스어로 그리스도)라고 고백하면서 시작되었습니다."
        ],
        "points": [
          "기독교의 뿌리는 고대 이스라엘의 유일신 신앙입니다.",
          "구약성경은 유대교의 히브리 성경과 대부분 같은 책입니다.",
          "“그리스도”는 메시아를 그리스어로 옮긴 말입니다."
        ],
        "terms": [
          "언약",
          "메시아",
          "율법(토라)"
        ],
        "summary": "기독교의 뿌리는 고대 이스라엘의 유일신 신앙입니다. 구약성경은 유대교의 히브리 성경과 대부분 같은 책입니다. “그리스도”는 메시아를 그리스어로 옮긴 말입니다.",
        "minutes": 3
      },
      {
        "id": "rome",
        "title": "로마 제국과 기독교",
        "unit": "역사",
        "level": "basic",
        "goal": "박해받던 소수 신앙이 로마 제국의 종교가 되기까지를 살펴봅니다.",
        "body": [
          "초기 그리스도인들은 황제 숭배를 거부해 여러 차례 박해를 받았습니다. 그래도 신앙은 도시를 중심으로 꾸준히 퍼졌습니다.",
          "313년 콘스탄티누스 황제의 밀라노 칙령으로 기독교가 공인되었고, 380년 테오도시우스 황제 때 로마의 국교가 되었습니다.",
          "325년 니케아 공의회와 451년 칼케돈 공의회는 삼위일체와 예수의 신성·인성에 관한 교리를 정리했습니다. 이 결정들은 오늘날 대부분의 교회가 함께 받아들이는 신앙의 바탕입니다."
        ],
        "points": [
          "313년 공인, 380년 국교.",
          "니케아·칼케돈 공의회에서 핵심 교리가 정리되었습니다.",
          "개신교도 이 시기의 신조(니케아 신경 등)를 대부분 받아들입니다."
        ],
        "terms": [
          "공의회",
          "신경(신조)"
        ],
        "summary": "313년 공인, 380년 국교. 니케아·칼케돈 공의회에서 핵심 교리가 정리되었습니다. 개신교도 이 시기의 신조(니케아 신경 등)를 대부분 받아들입니다.",
        "minutes": 3
      },
      {
        "id": "schism",
        "title": "동서 교회의 분열",
        "unit": "역사",
        "level": "basic",
        "goal": "동방 정교회와 서방 가톨릭 교회가 갈라진 까닭을 이해합니다.",
        "body": [
          "로마 제국이 동서로 나뉜 뒤, 서쪽은 라틴어와 로마 주교(교황)를 중심으로, 동쪽은 그리스어와 콘스탄티노폴리스 총대주교를 중심으로 교회 전통이 달라졌습니다.",
          "교황의 권위, 신경의 한 구절(성령이 “성자에게서도” 나오신다는 필리오케 문제), 전례의 차이 등이 쌓여 1054년 서로를 파문하는 일이 일어났습니다.",
          "이후 서방은 로마 가톨릭 교회, 동방은 정교회로 이어졌습니다. 16세기 종교개혁은 서방 교회 안에서 일어난 일입니다."
        ],
        "points": [
          "1054년 동서 교회가 공식적으로 갈라졌습니다.",
          "동방 정교회, 로마 가톨릭, 개신교가 기독교의 세 큰 갈래입니다."
        ],
        "terms": [
          "정교회",
          "필리오케"
        ],
        "summary": "1054년 동서 교회가 공식적으로 갈라졌습니다. 동방 정교회, 로마 가톨릭, 개신교가 기독교의 세 큰 갈래입니다.",
        "minutes": 3
      },
      {
        "id": "reform",
        "title": "루터와 칼뱅, 개혁의 여러 갈래",
        "unit": "역사",
        "level": "advanced",
        "goal": "종교개혁의 주요 인물과 그로부터 생긴 교파를 구분합니다.",
        "body": [
          "마르틴 루터는 1517년 면벌부 판매를 비판하는 95개조 논제를 내걸었고, 사람은 행위가 아니라 믿음으로 의롭게 된다고 가르쳤습니다(이신칭의). 성경을 독일어로 옮겨 누구나 읽게 했습니다.",
          "스위스 제네바의 장 칼뱅은 하나님의 주권과 예정을 강조하고, 장로들이 교회를 함께 다스리는 제도를 세웠습니다. 이 전통이 장로교와 개혁교회가 되었습니다.",
          "영국에서는 성공회가 생겼고, 재세례파는 신앙을 고백한 성인에게 세례를 주어야 한다고 주장했습니다. 이 흐름은 뒤에 침례교 등으로 이어졌습니다."
        ],
        "points": [
          "루터: 오직 믿음, 오직 성경, 오직 은혜.",
          "칼뱅: 하나님의 주권, 장로 제도 → 장로교.",
          "성공회·재세례파 등 개혁에는 여러 갈래가 있습니다."
        ],
        "terms": [
          "이신칭의",
          "예정",
          "장로교"
        ],
        "summary": "루터: 오직 믿음, 오직 성경, 오직 은혜. 칼뱅: 하나님의 주권, 장로 제도 → 장로교. 성공회·재세례파 등 개혁에는 여러 갈래가 있습니다.",
        "minutes": 3
      },
      {
        "id": "puritan",
        "title": "청교도와 근현대 기독교",
        "unit": "역사",
        "level": "advanced",
        "goal": "종교개혁 이후 개신교가 어떻게 세계로 퍼졌는지 살펴봅니다.",
        "body": [
          "17세기 영국의 청교도는 교회를 더 “깨끗하게” 개혁하자고 주장했고, 일부는 신앙의 자유를 찾아 북아메리카로 건너갔습니다.",
          "18세기 존 웨슬리는 개인의 회심과 거룩한 삶을 강조하는 운동을 이끌어 감리교의 시작이 되었습니다. 미국과 영국의 대각성 운동은 선교 운동으로 이어졌습니다.",
          "19~20세기에는 선교사들이 아시아·아프리카·라틴아메리카로 갔고, 20세기 초에는 성령의 은사를 강조하는 오순절 운동이 일어났습니다. 오늘날 기독교인은 남반구에 더 많이 삽니다."
        ],
        "points": [
          "청교도 → 북미 개신교의 바탕.",
          "웨슬리 → 감리교.",
          "오순절 운동은 20세기에 빠르게 성장했습니다."
        ],
        "terms": [
          "청교도",
          "감리교",
          "부흥"
        ],
        "summary": "청교도 → 북미 개신교의 바탕. 웨슬리 → 감리교. 오순절 운동은 20세기에 빠르게 성장했습니다.",
        "minutes": 3
      },
      {
        "id": "korea",
        "title": "한국 기독교의 전래와 발전",
        "unit": "역사",
        "level": "basic",
        "goal": "개신교가 한국에 어떻게 들어와 자리 잡았는지 알아봅니다.",
        "body": [
          "1880년대 만주와 일본에서 성경이 한글로 번역되었고, 1885년 부활절에 미국 선교사 아펜젤러(감리교)와 언더우드(장로교)가 제물포에 도착했습니다.",
          "선교사들은 배재학당·이화학당 같은 학교와 제중원 같은 병원을 세웠고, 한글 성경과 찬송은 한글 보급에도 영향을 주었습니다. 1907년 평양 대부흥은 한국 교회 성장의 계기로 꼽힙니다.",
          "3·1운동에는 기독교인이 많이 참여했고, 해방 뒤에는 교회가 빠르게 늘었습니다. 오늘날 한국에는 장로교·감리교·침례교·성결교·순복음 등 여러 교단이 있습니다."
        ],
        "points": [
          "1885년 아펜젤러·언더우드 입국.",
          "학교·병원·한글 성경으로 사회에 영향을 주었습니다.",
          "한국 개신교는 장로교 비중이 큽니다."
        ],
        "terms": [
          "교단"
        ],
        "summary": "1885년 아펜젤러·언더우드 입국. 학교·병원·한글 성경으로 사회에 영향을 주었습니다. 한국 개신교는 장로교 비중이 큽니다.",
        "minutes": 3
      },
      {
        "id": "creation",
        "title": "창조와 인간, 그리고 죄",
        "unit": "교리",
        "level": "basic",
        "goal": "세상과 인간을 어떻게 보는지 알아봅니다.",
        "body": [
          "창세기는 하나님이 세상을 창조하시고 “보시기에 좋았다”고 말합니다. 사람은 하나님의 형상대로 지어져 존엄하며, 세상을 돌볼 책임을 받았다고 봅니다.",
          "그러나 사람이 하나님을 떠나 스스로 주인이 되려 한 것을 죄라고 하며, 죄로 인해 하나님과 이웃, 세상과의 관계가 깨졌다고 설명합니다.",
          "창조 이야기를 문자 그대로 읽을지, 신학적 메시지로 읽을지는 교회와 학자마다 견해가 다릅니다."
        ],
        "points": [
          "인간은 하나님의 형상으로 지음 받았습니다.",
          "죄는 관계가 깨진 상태로 이해됩니다.",
          "창조 기사의 해석은 교회마다 다릅니다."
        ],
        "terms": [
          "창조",
          "하나님의 형상",
          "죄"
        ],
        "summary": "인간은 하나님의 형상으로 지음 받았습니다. 죄는 관계가 깨진 상태로 이해됩니다. 창조 기사의 해석은 교회마다 다릅니다.",
        "minutes": 3
      },
      {
        "id": "cross",
        "title": "십자가와 부활",
        "unit": "교리",
        "level": "basic",
        "goal": "기독교 신앙의 중심인 십자가와 부활을 이해합니다.",
        "body": [
          "기독교는 예수가 십자가에서 죽은 것을 사람의 죄를 대신 짊어진 희생으로 고백합니다. 그래서 십자가는 고통의 도구이면서 사랑과 용서의 상징이 되었습니다.",
          "사흘 만에 다시 살아났다는 부활은 죽음을 이긴 승리로 고백되며, 부활절은 교회의 가장 큰 절기입니다.",
          "개신교 예배당의 빈 십자가는 예수가 더 이상 십자가에 달려 있지 않고 부활했다는 뜻을 담고 있습니다."
        ],
        "points": [
          "십자가: 대신 짊어진 희생.",
          "부활: 죽음을 이긴 승리.",
          "빈 십자가에 부활의 의미가 담겨 있습니다."
        ],
        "terms": [
          "속죄",
          "부활"
        ],
        "summary": "십자가: 대신 짊어진 희생. 부활: 죽음을 이긴 승리. 빈 십자가에 부활의 의미가 담겨 있습니다.",
        "minutes": 3
      },
      {
        "id": "eschaton",
        "title": "종말, 재림, 천국과 지옥",
        "unit": "교리",
        "level": "advanced",
        "goal": "마지막 일에 관한 가르침과 해석의 차이를 알아봅니다.",
        "body": [
          "기독교는 역사가 하나님 안에서 완성된다고 믿으며, 그리스도가 다시 오시는 것(재림)을 기다립니다.",
          "죽은 이들의 부활과 심판이 있고, 하나님과 함께하는 영원한 삶(천국)과 하나님에게서 떨어진 상태(지옥)를 말합니다.",
          "재림의 시기와 방식, 천년왕국 해석은 교파와 신학자마다 크게 다릅니다. 시기를 정해 예언하는 주장은 대부분의 교회가 경계합니다."
        ],
        "points": [
          "재림과 부활을 기다립니다.",
          "천국·지옥의 표현과 해석은 다양합니다.",
          "날짜를 정하는 종말론은 주류 교회가 받아들이지 않습니다."
        ],
        "terms": [
          "재림",
          "종말론"
        ],
        "summary": "재림과 부활을 기다립니다. 천국·지옥의 표현과 해석은 다양합니다. 날짜를 정하는 종말론은 주류 교회가 받아들이지 않습니다.",
        "minutes": 3
      },
      {
        "id": "denoms",
        "title": "교파별 해석의 차이",
        "unit": "교리",
        "level": "advanced",
        "goal": "장로교·감리교·침례교·오순절 교회가 어떻게 다른지 비교합니다.",
        "body": [
          "장로교는 하나님의 주권과 장로가 함께 다스리는 교회 제도를 중시합니다. 감리교는 거룩한 삶과 사회적 실천을 강조합니다.",
          "침례교는 신앙을 고백한 사람에게 물에 잠기는 세례(침례)를 주고 각 교회의 자율을 존중합니다. 오순절·순복음 교회는 성령의 은사와 뜨거운 기도를 강조합니다.",
          "세례 방식, 교회 운영, 예배 분위기는 달라도 삼위일체와 예수의 십자가·부활이라는 핵심 고백은 대부분 같습니다."
        ],
        "points": [
          "차이는 주로 교회 제도·세례·강조점에 있습니다.",
          "핵심 고백은 대부분 같습니다."
        ],
        "terms": [
          "교파",
          "침례"
        ],
        "summary": "차이는 주로 교회 제도·세례·강조점에 있습니다. 핵심 고백은 대부분 같습니다.",
        "minutes": 3
      },
      {
        "id": "pentateuch",
        "title": "모세오경: 창세기와 출애굽기",
        "unit": "성경",
        "level": "basic",
        "goal": "성경의 첫 다섯 권과 핵심 이야기를 알아봅니다.",
        "body": [
          "창세기·출애굽기·레위기·민수기·신명기를 모세오경(토라)이라고 합니다.",
          "창세기는 창조, 노아의 홍수, 아브라함·이삭·야곱·요셉 이야기를 담고 있습니다. 출애굽기는 모세가 이스라엘 백성을 이집트에서 이끌어 내고 시내산에서 십계명을 받은 이야기입니다.",
          "이 책들은 하나님이 백성과 언약을 맺으신다는 성경 전체의 큰 줄기를 보여 줍니다."
        ],
        "points": [
          "오경 = 창·출·레·민·신.",
          "아브라함의 부르심과 출애굽이 중심 사건입니다.",
          "십계명은 출애굽기 20장에 있습니다."
        ],
        "terms": [
          "출애굽",
          "십계명"
        ],
        "summary": "오경 = 창·출·레·민·신. 아브라함의 부르심과 출애굽이 중심 사건입니다. 십계명은 출애굽기 20장에 있습니다.",
        "minutes": 3
      },
      {
        "id": "psalms",
        "title": "시편과 지혜서",
        "unit": "성경",
        "level": "basic",
        "goal": "기도와 노래, 삶의 지혜를 담은 책들을 알아봅니다.",
        "body": [
          "시편은 150편의 기도와 노래로, 찬양과 감사뿐 아니라 슬픔과 탄식까지 솔직하게 담겨 있습니다. 많은 시편이 다윗의 이름과 함께 전해집니다.",
          "잠언은 일상의 지혜를, 욥기는 의인의 고난이라는 질문을, 전도서는 삶의 허무와 의미를 다룹니다.",
          "예배와 개인 기도에서 시편을 함께 읽거나 노래하는 일이 많습니다."
        ],
        "points": [
          "시편은 성경의 기도집입니다.",
          "욥기·잠언·전도서는 삶의 질문을 다룹니다."
        ],
        "summary": "시편은 성경의 기도집입니다. 욥기·잠언·전도서는 삶의 질문을 다룹니다.",
        "minutes": 3
      },
      {
        "id": "gospels",
        "title": "네 복음서",
        "unit": "성경",
        "level": "basic",
        "goal": "예수의 생애를 전하는 네 책의 특징을 비교합니다.",
        "body": [
          "마태·마가·누가·요한복음은 예수의 생애와 가르침, 죽음과 부활을 전합니다. 앞의 세 복음서는 내용이 비슷해 공관복음이라고 부릅니다.",
          "마가복음은 가장 짧고 빠른 흐름, 마태복음은 구약의 성취와 산상수훈, 누가복음은 가난한 이와 이방인에 대한 관심, 요한복음은 예수가 누구인지에 대한 깊은 묵상이 특징입니다.",
          "같은 사건을 다른 관점에서 전하기 때문에 나란히 읽으면 더 입체적으로 이해할 수 있습니다."
        ],
        "points": [
          "공관복음 = 마태·마가·누가.",
          "요한복음은 신학적 묵상이 깊습니다.",
          "산상수훈은 마태복음 5~7장에 있습니다."
        ],
        "terms": [
          "복음서",
          "공관복음",
          "산상수훈"
        ],
        "summary": "공관복음 = 마태·마가·누가. 요한복음은 신학적 묵상이 깊습니다. 산상수훈은 마태복음 5~7장에 있습니다.",
        "minutes": 3
      },
      {
        "id": "acts",
        "title": "사도행전과 바울 서신",
        "unit": "성경",
        "level": "basic",
        "goal": "초기 교회의 확장과 편지들을 알아봅니다.",
        "body": [
          "사도행전은 누가복음의 뒷이야기로, 성령 강림 뒤 예루살렘에서 로마까지 복음이 퍼진 과정을 그립니다.",
          "바울은 처음에 그리스도인을 박해했지만 다마스쿠스로 가는 길에서 회심한 뒤 지중해 곳곳에 교회를 세웠습니다. 로마서·고린도서·갈라디아서 같은 편지는 그가 교회들에 보낸 것입니다.",
          "로마서는 믿음으로 의롭게 된다는 가르침을, 고린도전서 13장은 사랑의 의미를 담고 있어 널리 읽힙니다."
        ],
        "points": [
          "사도행전 = 교회의 시작과 확장.",
          "바울 서신은 신약의 절반 가까이 됩니다.",
          "로마서는 종교개혁에 큰 영향을 주었습니다."
        ],
        "terms": [
          "서신서",
          "회심"
        ],
        "summary": "사도행전 = 교회의 시작과 확장. 바울 서신은 신약의 절반 가까이 됩니다. 로마서는 종교개혁에 큰 영향을 주었습니다.",
        "minutes": 3
      },
      {
        "id": "revelation",
        "title": "요한계시록 읽기",
        "unit": "성경",
        "level": "advanced",
        "goal": "상징이 많은 마지막 책을 어떻게 읽는지 알아봅니다.",
        "body": [
          "요한계시록은 박해받던 1세기 교회에 보낸 묵시 문학으로, 환상과 숫자, 상징이 많습니다.",
          "많은 학자는 이 책을 미래의 연표가 아니라 고난 가운데 있는 교회에 “결국 하나님이 이기신다”는 희망을 주는 글로 읽습니다.",
          "상징을 오늘의 특정 사건이나 인물에 그대로 맞추는 해석은 주의해야 합니다. 이 점은 많은 교회가 함께 경계합니다."
        ],
        "points": [
          "묵시 문학이라는 장르를 이해해야 합니다.",
          "핵심 메시지는 희망과 하나님의 승리입니다."
        ],
        "terms": [
          "묵시"
        ],
        "summary": "묵시 문학이라는 장르를 이해해야 합니다. 핵심 메시지는 희망과 하나님의 승리입니다.",
        "minutes": 3
      }
    ],
    "etiquette": [
      "예배 중에는 휴대전화를 무음으로 하고 조용히 합니다.",
      "늦게 도착하면 기도 시간을 피해 조용히 뒷자리에 앉습니다.",
      "함께 기도하거나 찬양에 참여하는 것은 자유이며, 처음 온 사람에게 강요하지 않습니다.",
      "헌금은 자율입니다."
    ],
    "practice": [
      {
        "label": "찬송 듣기",
        "place": "traditional",
        "text": "오르간으로 옛 찬송을 듣습니다."
      },
      {
        "label": "침묵 기도",
        "place": "prayer",
        "text": "기도실에서 시간을 정해 조용히 기도합니다."
      },
      {
        "label": "기도 노트",
        "place": "prayer",
        "text": "나만 볼 수 있는 기도를 적어 둡니다."
      },
      {
        "label": "말씀 묵상",
        "place": "prayer",
        "text": "성경 구절과 묵상 질문을 따라갑니다."
      }
    ],
    "activities": [
      {
        "name": "기도",
        "text": "하나님께 마음을 털어놓고 감사와 바람을 아뢰는 대화입니다.",
        "meaning": "개신교는 누구나 예수 그리스도를 통해 하나님께 직접 나아갈 수 있다고 믿습니다(만인제사장). 정해진 형식보다 진실한 마음을 중시합니다.",
        "steps": [
          "조용한 곳에서 마음을 가라앉힙니다.",
          "하나님을 부르고 감사한 일을 먼저 말합니다.",
          "잘못을 돌아보고 용서를 구합니다.",
          "나와 이웃을 위한 바람을 아룁니다.",
          "“예수님의 이름으로 기도합니다. 아멘.”으로 마칩니다."
        ],
        "img": "prayer",
        "place": "prayer"
      },
      {
        "name": "예배",
        "text": "주일에 함께 모여 하나님을 높이고 말씀을 듣는 시간입니다.",
        "meaning": "부활하신 그리스도를 기념해 일요일(주일)에 드리며, 말씀 선포(설교)가 중심입니다. 성찬(주의 만찬)은 교회마다 정한 때에 함께 나눕니다.",
        "steps": [
          "예배 전 자리에 앉아 조용히 준비 기도를 합니다.",
          "찬송과 대표 기도에 함께합니다.",
          "성경 봉독과 설교를 듣습니다.",
          "헌금으로 감사를 표현합니다(선택).",
          "축도로 예배를 마칩니다."
        ],
        "img": "traditional",
        "place": "traditional"
      },
      {
        "name": "찬양",
        "text": "노래로 하나님께 감사와 고백을 드립니다.",
        "meaning": "종교개혁 이후 회중이 모국어로 함께 노래하는 전통이 자리 잡았습니다. 찬송가와 현대 찬양 모두 예배의 중요한 부분입니다.",
        "steps": [
          "가사의 뜻을 생각하며 듣습니다.",
          "따라 부르거나 마음속으로 함께합니다.",
          "노래가 끝나면 잠시 조용히 머뭅니다."
        ],
        "img": "modern",
        "place": "modern"
      },
      {
        "name": "성경 읽기",
        "text": "구약과 신약 66권을 차례로, 또는 계획을 세워 읽습니다.",
        "meaning": "개신교는 “오직 성경”을 강조하며, 누구나 스스로 성경을 읽고 이해하도록 권합니다.",
        "steps": [
          "하루에 읽을 분량을 정합니다(예: 복음서 한 장).",
          "천천히 읽고 마음에 남는 구절에 표시합니다.",
          "이해되지 않는 부분은 교회의 성경 공부나 해설을 참고합니다."
        ],
        "img": "traditional"
      },
      {
        "name": "묵상",
        "text": "짧은 말씀을 곱씹으며 오늘의 삶에 비추어 봅니다.",
        "meaning": "경건의 시간(QT)이라고도 부르며, 말씀을 읽고 생각하고 기도로 응답하는 개인 신앙 활동입니다.",
        "steps": [
          "짧은 본문을 두세 번 읽습니다.",
          "이 말씀이 나에게 무엇을 말하는지 생각합니다.",
          "깨달은 것을 짧게 적습니다.",
          "그 내용을 가지고 기도합니다."
        ],
        "img": "prayer",
        "place": "prayer"
      }
    ],
    "figures": [
      {
        "name": "예수 그리스도",
        "text": "하나님의 아들이자 구원자로 믿는 분입니다. 십자가에서 죽고 사흘 만에 부활했다고 고백합니다."
      },
      {
        "name": "빈 십자가",
        "text": "고난을 이기고 부활하셨음을 나타냅니다. 개신교 예배당에는 형상 없는 십자가를 둡니다."
      },
      {
        "name": "성경",
        "text": "구약 39권과 신약 27권. 신앙과 삶의 기준입니다."
      },
      {
        "name": "마르틴 루터",
        "text": "1517년 종교개혁을 시작한 독일의 신학자입니다. 개신교의 출발점으로 여겨집니다."
      }
    ],
    "scriptures": [
      {
        "name": "구약성경 (39권)",
        "text": "창조와 이스라엘의 역사, 율법, 시편 같은 시가서, 예언서로 이루어져 있습니다. 유대교의 경전과 대부분 겹칩니다."
      },
      {
        "name": "신약성경 (27권)",
        "text": "네 복음서(마태·마가·누가·요한), 사도행전, 바울 서신 등 서신서, 요한계시록으로 이루어져 있습니다."
      },
      {
        "name": "신앙고백과 교리문답",
        "text": "사도신경, 웨스트민스터 신앙고백, 하이델베르크 요리문답처럼 교파마다 신앙을 요약한 문서가 있습니다."
      }
    ],
    "symbols": [
      {
        "name": "빈 십자가",
        "text": "부활을 나타내며, 개신교 예배당 앞에 형상 없이 둡니다."
      },
      {
        "name": "강대상과 성경",
        "text": "말씀 선포가 예배의 중심이라는 뜻에서 예배당 가운데에 놓입니다."
      },
      {
        "name": "물고기(익투스)",
        "text": "초기 그리스도인들이 쓰던 표식으로, 그리스어 머리글자가 \"예수 그리스도, 하나님의 아들, 구원자\"를 뜻합니다."
      },
      {
        "name": "비둘기",
        "text": "성령을 상징합니다."
      },
      {
        "name": "종탑과 파이프 오르간",
        "text": "예배 시간을 알리는 종탑과 회중 찬송을 이끄는 오르간이 전통 교회의 특징입니다."
      }
    ],
    "culture": [
      {
        "name": "주일 성수",
        "text": "일요일을 주일로 지키며 예배와 쉼, 교제의 날로 보냅니다."
      },
      {
        "name": "소그룹과 봉사",
        "text": "구역·셀 모임에서 성경을 함께 읽고, 지역 사회 봉사와 구제를 합니다."
      },
      {
        "name": "절기",
        "text": "성탄절, 부활절, 성령강림절, 추수감사절, 종교개혁 기념일(10월 31일) 등을 지킵니다."
      }
    ],
    "glossary": [
      {
        "term": "복음",
        "original": "εὐαγγέλιον (그리스어)",
        "def": "“기쁜 소식”. 예수 그리스도를 통한 구원의 소식입니다."
      },
      {
        "term": "구원",
        "original": "",
        "def": "죄와 그 결과에서 건짐을 받아 하나님과 바른 관계를 회복하는 것입니다."
      },
      {
        "term": "은혜",
        "original": "",
        "def": "받을 자격 없이 하나님이 값없이 베푸시는 사랑과 선물입니다."
      },
      {
        "term": "삼위일체",
        "original": "Trinity",
        "def": "하나님은 한 분이시며 성부·성자·성령 세 위격으로 계신다는 교리입니다."
      },
      {
        "term": "성령",
        "original": "Holy Spirit",
        "def": "삼위일체의 세 번째 위격으로, 믿는 사람 안에서 일하신다고 고백합니다."
      },
      {
        "term": "언약",
        "original": "",
        "def": "하나님이 사람과 맺으신 약속. 구약(옛 언약)과 신약(새 언약)이라는 이름도 여기서 왔습니다."
      },
      {
        "term": "부활",
        "original": "",
        "def": "예수가 죽은 지 사흘 만에 다시 살아나셨다는 믿음이며, 믿는 이들의 부활 소망으로 이어집니다."
      }
    ],
    "faq": [
      {
        "q": "교회에 처음 가면 무엇을 해야 하나요?",
        "a": "예배 10분쯤 전에 도착해 안내하는 분께 처음 왔다고 말하면 자리와 순서를 알려 줍니다. 찬송과 기도는 할 수 있는 만큼 따라 하면 되고, 헌금은 하지 않아도 괜찮습니다."
      },
      {
        "q": "개신교와 천주교는 무엇이 다른가요?",
        "a": "같은 예수 그리스도를 믿지만, 개신교는 16세기 종교개혁에서 나와 “오직 성경·오직 믿음·오직 은혜”를 강조하고 교황의 권위와 성인 공경을 따르지 않습니다. 성사의 수(개신교는 대개 세례와 성찬 둘)도 다릅니다."
      },
      {
        "q": "교파가 왜 이렇게 많나요?",
        "a": "장로교·감리교·침례교·성결교·순복음 등은 교회 운영 방식, 세례 방식, 강조점의 차이로 나뉘었습니다. 핵심 신앙(삼위일체, 예수의 십자가와 부활)은 대부분 같습니다."
      }
    ],
    "quiz": [
      {
        "q": "개신교는 16세기 종교개혁에서 시작되었다.",
        "options": [
          "O",
          "X"
        ],
        "answer": 0,
        "explain": "1517년 마르틴 루터의 95개조 논제가 흔히 출발점으로 꼽힙니다.",
        "lesson": "reform"
      },
      {
        "q": "신약성경은 몇 권인가요?",
        "options": [
          "27권",
          "39권",
          "66권"
        ],
        "answer": 0,
        "explain": "구약 39권, 신약 27권, 합쳐서 66권입니다.",
        "lesson": "p2"
      },
      {
        "q": "개신교 예배당 앞에는 보통 예수의 형상이 달린 십자고상을 둔다.",
        "options": [
          "O",
          "X"
        ],
        "answer": 1,
        "explain": "개신교는 형상 없는 빈 십자가를 둡니다. 십자고상은 천주교 전통입니다.",
        "lesson": "space"
      },
      {
        "q": "대부분의 개신교회가 지키는 성례는?",
        "options": [
          "세례와 성찬",
          "일곱 성사",
          "고해와 견진"
        ],
        "answer": 0,
        "explain": "개신교는 대개 세례와 성찬(주의 만찬) 두 가지를 성례로 지킵니다.",
        "lesson": "p4"
      }
    ],
    "status": "checking",
    "festivals": [
      {
        "name": "대림절",
        "when": "성탄 전 4주",
        "text": "예수의 오심을 기다립니다."
      },
      {
        "name": "성탄절",
        "when": "12월 25일",
        "text": "예수의 탄생을 기념합니다."
      },
      {
        "name": "사순절 · 고난주간",
        "when": "부활절 전 40일",
        "text": "예수의 고난을 묵상합니다."
      },
      {
        "name": "부활절",
        "when": "춘분 뒤 첫 보름달 다음 주일",
        "text": "예수의 부활을 기념합니다."
      },
      {
        "name": "성령강림절",
        "when": "부활절 뒤 50일째",
        "text": "성령이 내려온 날."
      },
      {
        "name": "추수감사절",
        "when": "한국 교회는 대개 11월",
        "text": "한 해의 은혜에 감사합니다."
      }
    ],
    "festivalNote": "교회력을 얼마나 지키는지는 교단과 교회마다 다릅니다.",
    "sources": [
      "대한성서공회 성경 안내",
      "한국민족문화대백과사전 \"개신교\"",
      "Encyclopaedia Britannica, \"Protestantism\""
    ],
    "discover": [
      {
        "q": "교회는 왜 십자가를 사용할까요?",
        "a": "십자가는 예수가 사람들을 위해 희생했고 다시 살아났다는 믿음을 기억하게 해요. 개신교 교회에는 보통 형상이 없는 빈 십자가를 두는데, 부활을 강조하는 뜻이 있어요.",
        "lesson": "cross",
        "place": "traditional"
      },
      {
        "q": "예배는 어떤 의미일까요?",
        "a": "주일에 함께 모여 하나님께 감사하고 말씀을 듣는 시간이에요. 찬송, 기도, 성경 읽기, 설교가 이어지며 교회마다 순서는 조금씩 달라요.",
        "lesson": "p4",
        "place": "traditional"
      },
      {
        "q": "예수는 어떤 가르침을 전했을까요?",
        "a": "하나님 나라가 가까이 왔다고 전하며, 하나님과 이웃을 사랑하라고 가르쳤어요. 가난하고 소외된 사람들과 함께하고 용서를 강조했어요.",
        "lesson": "p1"
      },
      {
        "q": "성경에는 어떤 이야기가 담겨 있을까요?",
        "a": "세상의 창조, 아브라함과 모세, 다윗 왕, 예언자들, 예수의 생애와 초기 교회 이야기까지 오랜 시간에 걸친 이야기와 시, 편지가 담겨 있어요.",
        "lesson": "p2"
      }
    ]
  },
  "en": {
    "title": "Christianity (Protestant)",
    "sub": "Word and grace · Jesus Christ",
    "intro": "Christianity is faith in the life and teaching, death on the cross and resurrection of Jesus Christ, who lived in 1st-century Palestine. Protestantism emerged from the Reformation begun by Martin Luther in 1517 and spread widely in Korea after missionaries Appenzeller and Underwood arrived in 1885.",
    "start": {
      "title": "Your first church visit",
      "text": "Enter, take a seat, look at the pulpit and organ, and learn how a service flows.",
      "place": "traditional"
    },
    "lessons": [
      {
        "id": "believe",
        "title": "What Christians believe",
        "body": [
          "One God as Father, Son (Jesus Christ) and Holy Spirit: the Trinity.",
          "Salvation by faith in Jesus Christ rather than by one's own deeds."
        ]
      },
      {
        "id": "bible",
        "title": "The Bible",
        "body": [
          "The Protestant Bible has 66 books: 39 in the Old Testament and 27 in the New.",
          "The Old Testament tells of creation, Israel's history, law and prophets; the New holds the four Gospels, Acts and the apostles' letters."
        ]
      },
      {
        "id": "reform",
        "title": "The Reformation",
        "body": [
          "Begun with Luther's 95 Theses in 1517, it stressed Scripture alone, faith alone and grace alone.",
          "Today there are many denominations — Presbyterian, Methodist, Baptist, Holiness, Pentecostal and more — with varied styles of worship."
        ]
      },
      {
        "id": "worship",
        "title": "Worship",
        "body": [
          "Services often move through hymns, prayer, Scripture reading, sermon, offering and benediction, centred on the sermon.",
          "Baptism and the Lord's Supper are kept as sacraments.",
          "Traditional churches use organ and choir; contemporary churches a worship band."
        ]
      },
      {
        "id": "space",
        "title": "The church space",
        "body": [
          "The pulpit, where the Word is preached, stands at the centre.",
          "The cross recalls Jesus' death and resurrection; Protestant churches usually show an empty cross without a figure."
        ]
      }
    ],
    "etiquette": [
      "Silence your phone and keep quiet during the service.",
      "If late, enter quietly outside prayer time and sit at the back.",
      "Joining in prayer or song is up to you; newcomers are never pressed.",
      "Giving is voluntary."
    ],
    "practice": [
      {
        "label": "Listen to a hymn",
        "place": "traditional",
        "text": "Hear an old hymn on the organ."
      },
      {
        "label": "Silent prayer",
        "place": "prayer",
        "text": "Pray quietly for a set time."
      },
      {
        "label": "Prayer notes",
        "place": "prayer",
        "text": "Keep private prayer notes."
      },
      {
        "label": "Scripture reflection",
        "place": "prayer",
        "text": "Follow passages and reflection questions."
      }
    ],
    "activities": [
      {
        "name": "Prayer",
        "text": "An honest conversation with God: thanks, confession and requests.",
        "meaning": "Protestants believe anyone may come to God directly through Jesus Christ (the priesthood of all believers). A sincere heart matters more than set words.",
        "steps": [
          "Find a quiet place and settle your mind.",
          "Address God and begin with thanks.",
          "Reflect on wrongs and ask forgiveness.",
          "Bring your needs and those of others.",
          "Close with “In Jesus’ name, Amen.”"
        ],
        "img": "prayer",
        "place": "prayer"
      },
      {
        "name": "Worship",
        "text": "Gathering on Sunday to praise God and hear the Word.",
        "meaning": "Held on Sunday in memory of the resurrection, with the sermon at its centre. Communion (the Lord’s Supper) is shared at times each church sets.",
        "steps": [
          "Sit and pray quietly before the service.",
          "Join the hymns and the pastoral prayer.",
          "Listen to the Bible reading and sermon.",
          "Give an offering if you wish.",
          "The benediction closes the service."
        ],
        "img": "traditional",
        "place": "traditional"
      },
      {
        "name": "Praise",
        "text": "Thanks and confession offered in song.",
        "meaning": "Since the Reformation congregations have sung together in their own language. Hymns and contemporary songs are both part of worship.",
        "steps": [
          "Listen with the meaning of the words in mind.",
          "Sing along or join silently.",
          "Stay quiet for a moment when the song ends."
        ],
        "img": "modern",
        "place": "modern"
      },
      {
        "name": "Bible reading",
        "text": "Reading the 66 books in order or following a plan.",
        "meaning": "Protestants stress “Scripture alone” and encourage everyone to read the Bible for themselves.",
        "steps": [
          "Choose a daily portion, such as one chapter of a Gospel.",
          "Read slowly and mark verses that stay with you.",
          "Use a church study group or commentary for hard passages."
        ],
        "img": "traditional"
      },
      {
        "name": "Devotion",
        "text": "Turning over a short passage and applying it to today.",
        "meaning": "Often called quiet time: reading, reflecting and answering in prayer.",
        "steps": [
          "Read a short passage two or three times.",
          "Ask what it says to you.",
          "Write down a line of what you learned.",
          "Pray with it."
        ],
        "img": "prayer",
        "place": "prayer"
      }
    ],
    "figures": [
      {
        "name": "Jesus Christ",
        "text": "Believed to be the Son of God and Saviour, who died on the cross and rose on the third day."
      },
      {
        "name": "The empty cross",
        "text": "Points to the resurrection. Protestant churches use a cross without a figure."
      },
      {
        "name": "The Bible",
        "text": "39 books of the Old Testament and 27 of the New: the rule of faith and life."
      },
      {
        "name": "Martin Luther",
        "text": "German theologian who began the Reformation in 1517."
      }
    ],
    "scriptures": [
      {
        "name": "Old Testament (39 books)",
        "text": "Creation, the history of Israel, the Law, poetry such as the Psalms, and the Prophets; largely shared with the Hebrew Bible."
      },
      {
        "name": "New Testament (27 books)",
        "text": "The four Gospels, Acts, letters such as Paul’s, and Revelation."
      },
      {
        "name": "Creeds and catechisms",
        "text": "The Apostles’ Creed, the Westminster Confession and the Heidelberg Catechism summarise faith for different traditions."
      }
    ],
    "symbols": [
      {
        "name": "The empty cross",
        "text": "Points to the resurrection; placed without a figure at the front of Protestant churches."
      },
      {
        "name": "Pulpit and Bible",
        "text": "Central because preaching the Word is the heart of worship."
      },
      {
        "name": "The fish (ichthys)",
        "text": "An early Christian sign; the Greek letters stand for “Jesus Christ, Son of God, Saviour”."
      },
      {
        "name": "The dove",
        "text": "A symbol of the Holy Spirit."
      },
      {
        "name": "Bell tower and pipe organ",
        "text": "The bell calls to worship and the organ leads congregational song in traditional churches."
      }
    ],
    "culture": [
      {
        "name": "Keeping the Lord’s Day",
        "text": "Sunday is kept for worship, rest and fellowship."
      },
      {
        "name": "Small groups and service",
        "text": "Home groups read the Bible together; churches serve their neighbourhoods."
      },
      {
        "name": "The church year",
        "text": "Christmas, Easter, Pentecost, Thanksgiving and Reformation Day (31 October)."
      }
    ],
    "glossary": [
      {
        "term": "Gospel",
        "original": "εὐαγγέλιον (Greek)",
        "def": "“Good news”: the news of salvation through Jesus Christ."
      },
      {
        "term": "Salvation",
        "original": "",
        "def": "Being rescued from sin and its results and restored to a right relationship with God."
      },
      {
        "term": "Grace",
        "original": "",
        "def": "God’s free gift and love, given without being earned."
      },
      {
        "term": "Trinity",
        "original": "",
        "def": "One God in three persons: Father, Son and Holy Spirit."
      },
      {
        "term": "Holy Spirit",
        "original": "",
        "def": "The third person of the Trinity, confessed to work within believers."
      },
      {
        "term": "Covenant",
        "original": "",
        "def": "A promise God makes with people; the source of the names Old and New Testament."
      },
      {
        "term": "Resurrection",
        "original": "",
        "def": "The belief that Jesus rose on the third day, and the hope that believers will rise."
      }
    ],
    "faq": [
      {
        "q": "What should I do on my first visit to a church?",
        "a": "Arrive about ten minutes early and tell a greeter it is your first time; they will show you a seat and the order of service. Join the songs and prayers as you feel able; you do not have to give an offering."
      },
      {
        "q": "How do Protestants differ from Catholics?",
        "a": "Both follow Jesus Christ. Protestantism came from the 16th-century Reformation, stresses Scripture, faith and grace alone, and does not follow papal authority or the veneration of saints. Most Protestants keep two sacraments, baptism and communion."
      },
      {
        "q": "Why are there so many denominations?",
        "a": "Presbyterian, Methodist, Baptist, Pentecostal and other churches differ in governance, baptism and emphasis, while most share the core faith in the Trinity and Christ’s cross and resurrection."
      }
    ],
    "quiz": [
      {
        "q": "Protestantism began with the 16th-century Reformation.",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explain": "Martin Luther’s 95 Theses of 1517 are usually taken as the starting point.",
        "lesson": "reform"
      },
      {
        "q": "How many books are in the New Testament?",
        "options": [
          "27",
          "39",
          "66"
        ],
        "answer": 0,
        "explain": "39 in the Old Testament, 27 in the New, 66 in all.",
        "lesson": "bible"
      },
      {
        "q": "Protestant churches usually place a crucifix with the figure of Jesus at the front.",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explain": "Protestant churches use an empty cross; the crucifix is a Catholic tradition.",
        "lesson": "space"
      },
      {
        "q": "Which sacraments do most Protestant churches keep?",
        "options": [
          "Baptism and communion",
          "Seven sacraments",
          "Confession and confirmation"
        ],
        "answer": 0,
        "explain": "Most keep two: baptism and the Lord’s Supper.",
        "lesson": "worship"
      }
    ],
    "status": "checking",
    "festivals": [
      {
        "name": "Advent",
        "when": "4 weeks before Christmas",
        "text": "Waiting for Christ's coming."
      },
      {
        "name": "Christmas",
        "when": "25 December",
        "text": "The birth of Jesus."
      },
      {
        "name": "Lent · Holy Week",
        "when": "40 days before Easter",
        "text": "Reflecting on Christ's suffering."
      },
      {
        "name": "Easter",
        "when": "Sunday after the first full moon after the equinox",
        "text": "The resurrection."
      },
      {
        "name": "Pentecost",
        "when": "50th day after Easter",
        "text": "The coming of the Holy Spirit."
      },
      {
        "name": "Thanksgiving",
        "when": "Usually November in Korea",
        "text": "Thanks for the year's blessings."
      }
    ],
    "festivalNote": "How closely the church year is kept differs by denomination and congregation.",
    "sources": [
      "Korean Bible Society",
      "Encyclopedia of Korean Culture, \"Protestantism\"",
      "Encyclopaedia Britannica, \"Protestantism\""
    ],
    "discover": [
      {
        "q": "Why do churches use the cross?",
        "a": "It recalls the belief that Jesus gave his life for people and rose again. Protestant churches usually show an empty cross, stressing the resurrection.",
        "lesson": "space",
        "place": "traditional"
      },
      {
        "q": "What does worship mean?",
        "a": "Gathering on Sunday to thank God and hear the Word, with hymns, prayer, Bible reading and a sermon; the order varies by church.",
        "lesson": "worship",
        "place": "traditional"
      },
      {
        "q": "What did Jesus teach?",
        "a": "That the kingdom of God is near, and to love God and neighbour. He stood with the poor and outcast and stressed forgiveness.",
        "lesson": "believe"
      },
      {
        "q": "What stories are in the Bible?",
        "a": "Creation, Abraham and Moses, King David, the prophets, the life of Jesus and the early church: stories, poems and letters over many centuries.",
        "lesson": "bible"
      }
    ]
  }
}

export default pack
