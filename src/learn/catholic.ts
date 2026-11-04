import type { LearnPack } from './types'

// 강의 본문: 사용자 제공 「실제 학습 본문 초안」(p1~p4) + 보강 강의. 게시 전 전문가 검수 필요.
const pack: LearnPack = {
  "ko": {
    "title": "천주교 (가톨릭)",
    "sub": "보편 교회 · 성사와 전례",
    "intro": "가톨릭은 \"보편적\"이라는 뜻으로, 사도들로부터 이어진 교회가 교황을 중심으로 하나의 공동체를 이룹니다. 한국 천주교는 1784년 이승훈이 북경에서 세례를 받고 돌아오면서 평신도 스스로 시작한 드문 역사를 가졌고, 박해 속 순교자 103위가 1984년 성인으로 선포되었습니다.",
    "start": {
      "title": "처음 성당에 가 보기",
      "text": "성수로 십자성호를 긋고, 신자석과 제대, 봉헌초, 십자가의 길을 차례로 둘러보는 안내입니다.",
      "place": "gothic"
    },
    "lessons": [
      {
        "id": "p1",
        "title": "가톨릭교회와 전통",
        "goal": "가톨릭교회의 조직, 역사, 성경과 전승의 관계를 이해한다.",
        "body": [
          "가톨릭교회는 예수와 사도들의 전승을 이어받은 보편 교회라는 자기 이해를 갖는다. 로마 주교인 교황은 교회의 일치와 가르침을 위한 특별한 역할을 맡는다. 지역 교회에는 주교·사제·부제가 봉사하며 수도회와 평신도 공동체도 교회 생활에 참여한다.",
          "가톨릭의 역사는 초기 기독교 공동체에서 출발해 로마 제국 시대, 중세, 종교개혁과 가톨릭 개혁, 근현대의 변화로 이어진다. 제2차 바티칸 공의회(1962~1965)는 전례와 현대 사회, 다른 그리스도교 공동체 및 타종교와의 관계에 중요한 변화를 가져왔다.",
          "가톨릭은 성경과 사도들로부터 전해진 전승, 교회의 가르침을 함께 중요하게 본다. 성모 마리아와 성인들을 공경하지만 하느님께 드리는 흠숭과 성인 공경을 구분한다. 성인 공경은 그들을 신으로 여긴다는 뜻이 아니라 신앙의 모범과 전구를 구하는 전통으로 설명된다."
        ],
        "termDefs": [
          {
            "term": "교황",
            "def": "로마 주교이자 가톨릭교회의 최고 목자."
          },
          {
            "term": "주교",
            "def": "지역 교회를 책임지는 성직자."
          },
          {
            "term": "전승",
            "def": "사도적 신앙이 교회의 삶과 가르침 안에서 전해지는 전통."
          }
        ],
        "summary": "가톨릭은 성경·전승·교회의 가르침을 함께 중시하며 성인 공경과 흠숭을 구분한다.",
        "think": "성인 공경과 하느님께 드리는 흠숭을 어떻게 구분해야 할까?",
        "thinkGuide": "가톨릭은 하느님께만 드리는 흠숭(라트리아)과 성모·성인에게 드리는 공경(둘리아)을 구분합니다. 성인에게는 '하느님께 함께 기도해 주시기를(전구)' 청하는 것이지, 그들을 신으로 섬기는 것이 아니라고 설명합니다.",
        "level": "intro",
        "unit": "교회와 전통",
        "minutes": 3
      },
      {
        "id": "p2",
        "title": "미사와 일곱 성사",
        "goal": "미사의 기본 구조와 일곱 성사의 의미를 개괄한다.",
        "body": [
          "미사는 가톨릭교회의 중심 전례이며 말씀 전례와 성찬 전례를 중심으로 진행된다. 말씀 전례에서는 성경 봉독과 강론을 통해 말씀을 듣는다. 성찬 전례에서는 빵과 포도주를 봉헌하고 축성하며, 가톨릭 신앙에서 그리스도의 몸과 피로 받아 모시는 성체성사가 거행된다.",
          "미사의 일반적인 흐름에는 입당, 참회 예식, 말씀 전례, 보편 지향 기도, 예물 준비, 감사 기도, 영성체, 파견 등이 포함된다. 전례 시기와 지역 관습에 따라 세부 요소는 달라질 수 있다.",
          "일곱 성사는 세례·견진·성체·고해·병자·성품·혼인성사다. 세례는 그리스도교 입문, 견진은 신앙을 굳건히 함, 성체는 그리스도와의 친교, 고해는 죄의 용서와 화해, 병자성사는 병중의 은총과 위로, 성품은 교회 봉사를 위한 직무, 혼인은 부부의 사랑과 신의를 성사적으로 드러낸다. 실제 참여 조건은 성사별로 다르므로 본당의 안내를 확인한다."
        ],
        "termDefs": [
          {
            "term": "미사",
            "def": "가톨릭교회의 중심 전례."
          },
          {
            "term": "성체성사",
            "def": "그리스도의 몸과 피를 기념하고 받아 모시는 성사."
          },
          {
            "term": "영성체",
            "def": "미사에서 성체를 받아 모시는 행위."
          },
          {
            "term": "고해성사",
            "def": "죄를 고백하고 하느님과 교회와 화해하는 성사."
          }
        ],
        "summary": "미사는 말씀과 성찬을 중심으로 하며 일곱 성사는 교회 안에서 은총을 드러내는 표지로 이해된다.",
        "think": "의례에 직접 참여하기 전에 의미와 참여 조건을 확인해야 하는 이유는?",
        "thinkGuide": "성사는 공동체 안에서 정해진 조건과 준비가 있는 의례입니다. 예를 들어 영성체는 세례받은 가톨릭 신자가 하며, 처음 온 사람은 자리에 앉아 있거나 팔을 가슴에 모으고 나가 축복을 받을 수 있습니다. 조건을 알면 실수 없이 존중하며 함께할 수 있습니다.",
        "level": "intro",
        "unit": "전례",
        "place": "parish",
        "minutes": 3
      },
      {
        "id": "p3",
        "title": "성당의 구조와 상징",
        "goal": "성당의 주요 공간과 성물을 이해한다.",
        "body": [
          "성당의 중심에는 제대가 있으며 성찬례가 거행되는 장소다. 독서대에서는 성경을 봉독하고 감실에는 축성된 성체를 모신다. 성수대는 신자들이 성수를 사용하며 세례를 기억하도록 돕는다.",
          "십자가는 예수의 십자가형과 기독교 신앙의 중심 메시지를 나타낸다. 십자고상은 십자가에 달린 예수의 형상이 있는 십자가다. 가톨릭 성당에서는 제대 가까이에 십자고상이 놓이는 경우가 많고, 성모상과 성인상은 별도 기도 공간에 배치될 수 있다.",
          "고딕 성당은 높은 천장과 첨두 아치, 스테인드글라스가 특징인 경우가 많고 로마네스크 양식은 두꺼운 벽과 둥근 아치가 두드러진다. 현대 성당은 간결한 재료와 자연광을 활용하기도 한다. 방문자는 미사 중 촬영과 이동을 삼가고 제대·감실 등 제한 공간에 허락 없이 들어가지 않는다."
        ],
        "termDefs": [
          {
            "term": "제대",
            "def": "성찬례가 거행되는 중심 장소."
          },
          {
            "term": "감실",
            "def": "축성된 성체를 모셔 두는 장소."
          },
          {
            "term": "독서대",
            "def": "전례 중 성경을 봉독하는 장소."
          },
          {
            "term": "십자고상",
            "def": "예수의 형상이 있는 십자가."
          }
        ],
        "summary": "성당의 건축과 성물은 미사와 기도, 신앙 공동체의 삶에 연결되어 있다.",
        "think": "성당의 물건을 단순한 장식이 아니라 전례의 일부로 보면 공간이 어떻게 다르게 보일까?",
        "thinkGuide": "제대는 식탁, 감실은 성체를 모신 곳, 독서대는 말씀을 읽는 자리라는 것을 알면, 성당 안의 동선과 사람들이 고개를 숙이는 방향, 감실등이 켜져 있는 이유가 하나로 이어져 보입니다.",
        "level": "basic",
        "unit": "성당",
        "place": "gothic",
        "minutes": 3
      },
      {
        "id": "p4",
        "title": "전례력과 기도 생활",
        "goal": "전례력과 주요 신심 활동을 이해한다.",
        "body": [
          "가톨릭 전례력은 예수 그리스도의 생애와 구원 사건을 한 해의 흐름 속에서 기념한다. 대림은 성탄을 준비하는 시기, 성탄은 예수의 탄생을 기념하는 시기다. 사순은 회개와 기도·절제의 기간이며 성주간은 예수의 수난과 죽음을 기억한다. 부활 시기는 부활의 기쁨을 기념하고 연중 시기는 신앙의 여러 측면을 묵상한다.",
          "묵주기도는 성모 마리아와 함께 예수 그리스도의 생애에서 중요한 신비를 묵상하는 기도다. 묵주알을 세며 기도문을 반복하지만 반복 자체가 목적은 아니다. 복음의 장면을 묵상하는 것이 중심이다.",
          "성체조배는 성체 앞에서 침묵과 기도로 머무르는 신심 행위이며, 십자가의 길은 예수의 수난 여정을 묵상하는 기도다. 개인 기도에는 감사·청원·찬미·참회·침묵과 묵상 등 다양한 형태가 있다."
        ],
        "termDefs": [
          {
            "term": "대림",
            "def": "성탄을 준비하는 전례 시기."
          },
          {
            "term": "사순",
            "def": "부활을 준비하며 회개와 절제를 실천하는 시기."
          },
          {
            "term": "묵주기도",
            "def": "묵주를 사용해 복음의 신비를 묵상하는 기도."
          },
          {
            "term": "성체조배",
            "def": "성체 앞에서 기도하고 묵상하는 신심 행위."
          }
        ],
        "summary": "전례력은 그리스도교의 주요 사건을 한 해 동안 기념하며 다양한 기도 전통을 안내한다.",
        "think": "바쁜 일상에서 감사와 성찰을 위한 시간을 어떻게 마련할 수 있을까?",
        "thinkGuide": "하루 몇 분의 침묵, 잠들기 전 하루를 돌아보는 성찰, 묵주 한 단 정도의 짧은 기도처럼 작게 시작하는 방법이 있습니다. 전례력처럼 한 해의 리듬을 따라가는 것도 일상의 쉼표가 됩니다.",
        "level": "basic",
        "unit": "전례와 기도",
        "place": "grotto",
        "minutes": 3
      }
    ],
    "etiquette": [
      "성당에 들어설 때 성수를 찍어 십자성호를 긋습니다(신자가 아니면 생략해도 됩니다).",
      "감실을 향해 가볍게 고개 숙여 절합니다.",
      "미사 중에는 조용히 하고, 사진은 삼갑니다.",
      "영성체는 신자만 모십니다.",
      "고해소는 성사를 위한 곳이므로 함부로 들어가지 않습니다."
    ],
    "practice": [
      {
        "label": "촛불 봉헌",
        "place": "grotto",
        "text": "성모 동산에서 초를 밝힙니다."
      },
      {
        "label": "묵주기도",
        "place": "grotto",
        "text": "오늘의 신비를 따라 묵주기도를 바칩니다."
      },
      {
        "label": "십자가의 길",
        "place": "gothic",
        "text": "14처를 따라 예수의 수난을 묵상합니다."
      },
      {
        "label": "전례력",
        "place": "parish",
        "text": "지금의 전례 시기와 다가오는 대축일을 봅니다."
      }
    ],
    "activities": [
      {
        "name": "촛불 봉헌",
        "text": "봉헌초에 불을 밝혀 기도하는 마음을 하느님께 올립니다.",
        "meaning": "초는 그리스도의 빛과, 자리를 떠난 뒤에도 기도가 이어지기를 바라는 마음을 나타냅니다.",
        "steps": [
          "봉헌대 앞에서 잠시 마음을 모읍니다.",
          "이미 켜진 초에서 불을 옮겨 새 초를 밝힙니다.",
          "기도 지향을 마음속으로 바칩니다.",
          "성호를 긋고 조용히 물러납니다."
        ],
        "img": "gothic",
        "place": "gothic"
      },
      {
        "name": "묵주기도",
        "text": "묵주 알을 하나씩 넘기며 주님의 기도와 성모송을 바칩니다.",
        "meaning": "예수 그리스도의 생애를 성모 마리아와 함께 묵상하는 기도입니다. 환희·빛·고통·영광의 신비로 나뉩니다.",
        "steps": [
          "십자가를 잡고 성호를 그은 뒤 사도신경을 바칩니다.",
          "한 단마다 주님의 기도 1번, 성모송 10번, 영광송 1번을 바칩니다.",
          "각 단에서 그날의 신비를 묵상합니다.",
          "다섯 단을 마치면 성모 찬송으로 끝맺습니다."
        ],
        "img": "grotto",
        "place": "grotto"
      },
      {
        "name": "십자가의 길",
        "text": "예수님의 수난 여정을 14처를 따라 걸으며 묵상합니다.",
        "meaning": "예루살렘 순례 전통에서 비롯되었고, 특히 사순 시기 금요일에 많이 바칩니다.",
        "steps": [
          "제1처(사형 선고)부터 차례로 이동합니다.",
          "각 처에서 그 장면을 바라보며 묵상합니다.",
          "짧은 기도를 바치고 다음 처로 옮깁니다.",
          "제14처(무덤에 묻히심)에서 마칩니다."
        ],
        "img": "gothic",
        "place": "gothic"
      },
      {
        "name": "전례력",
        "text": "대림·성탄·사순·부활·연중 시기로 한 해를 보냅니다.",
        "meaning": "교회는 그리스도의 생애를 1년 주기로 기념하며, 시기마다 제의 색(보라·흰색·초록·빨강)이 바뀝니다.",
        "steps": [
          "지금이 어느 시기인지 확인합니다.",
          "시기에 맞는 기도와 독서를 따릅니다.",
          "주일과 의무 대축일에는 미사에 참례합니다."
        ],
        "img": "parish",
        "place": "parish"
      },
      {
        "name": "성경 읽기",
        "text": "그날 미사의 독서와 복음을 미리 읽고 묵상합니다.",
        "meaning": "천주교는 성경과 성전(전승)을 함께 소중히 여깁니다. 렉시오 디비나(거룩한 독서)라는 오래된 읽기 방법이 있습니다.",
        "steps": [
          "읽기: 본문을 천천히 읽습니다.",
          "묵상: 마음에 머무는 말씀을 되새깁니다.",
          "기도: 말씀에 응답해 기도합니다.",
          "관상: 말없이 하느님 안에 머뭅니다."
        ],
        "img": "parish"
      }
    ],
    "figures": [
      {
        "name": "예수 그리스도",
        "text": "성부·성자·성령 삼위일체의 성자로, 인류를 구원하기 위해 사람이 되신 분으로 믿습니다."
      },
      {
        "name": "성모 마리아",
        "text": "예수님의 어머니입니다. 하느님처럼 흠숭하지 않고, 신앙의 모범으로 공경합니다."
      },
      {
        "name": "교황",
        "text": "사도 베드로의 후계자로 여겨지는 로마의 주교이며, 전 세계 가톨릭 교회의 목자입니다."
      },
      {
        "name": "십자고상",
        "text": "예수님의 형상이 있는 십자가로, 그리스도의 희생을 기억하게 합니다. 제대 위나 가까이에 둡니다."
      },
      {
        "name": "감실과 감실등",
        "text": "성체를 모신 곳입니다. 곁의 붉은 등이 켜져 있으면 성체가 모셔져 있다는 뜻입니다."
      }
    ],
    "scriptures": [
      {
        "name": "가톨릭 성경 (73권)",
        "text": "구약 46권과 신약 27권입니다. 토빗기·유딧기·마카베오기 같은 제2경전이 구약에 들어 있습니다."
      },
      {
        "name": "가톨릭 교회 교리서",
        "text": "1992년에 나온, 신앙과 성사, 계명과 기도를 정리한 공식 교리서입니다."
      },
      {
        "name": "공의회 문헌과 교황 회칙",
        "text": "제2차 바티칸 공의회(1962~1965) 문헌과 교황의 회칙은 교회의 가르침을 오늘에 맞게 풀어 줍니다."
      }
    ],
    "symbols": [
      {
        "name": "제대",
        "text": "미사에서 성찬 전례가 거행되는 중심 탁자입니다."
      },
      {
        "name": "감실과 감실등",
        "text": "성체를 모신 곳이며, 붉은 등이 켜져 있으면 성체가 계시다는 뜻입니다."
      },
      {
        "name": "십자고상",
        "text": "예수의 형상이 있는 십자가로 제대 위나 가까이에 둡니다."
      },
      {
        "name": "성수대",
        "text": "입구의 성수를 찍어 성호를 그으며 세례를 기억합니다."
      },
      {
        "name": "성모상",
        "text": "성모 마리아를 공경하는 마음으로 제대 옆이나 성모 동산에 모십니다."
      }
    ],
    "culture": [
      {
        "name": "주일 미사",
        "text": "주일과 의무 대축일에는 미사에 참례하는 것이 신자의 의무입니다."
      },
      {
        "name": "세례명",
        "text": "세례 때 성인의 이름을 받아 그 성인을 수호성인으로 삼습니다."
      },
      {
        "name": "피정과 성지 순례",
        "text": "일상을 떠나 기도에 머무는 피정, 순교 성지를 찾는 순례가 활발합니다."
      }
    ],
    "glossary": [
      {
        "term": "미사",
        "original": "Missa (라틴어)",
        "def": "말씀 전례와 성찬 전례로 이루어진 천주교의 중심 예배입니다."
      },
      {
        "term": "성사",
        "original": "Sacramentum",
        "def": "하느님의 은총을 드러내고 전하는 일곱 가지 표징(세례·견진·성체·고해·병자·성품·혼인)입니다."
      },
      {
        "term": "성체",
        "original": "Eucharist",
        "def": "미사에서 축성된 빵으로, 그리스도의 몸으로 믿습니다."
      },
      {
        "term": "묵주",
        "original": "Rosary",
        "def": "묵주기도를 바칠 때 쓰는 구슬 꿰미입니다."
      },
      {
        "term": "전례",
        "original": "Liturgy",
        "def": "교회가 공적으로 드리는 예배와 그 형식입니다."
      },
      {
        "term": "교황",
        "original": "Pope",
        "def": "로마의 주교이자 베드로 사도의 후계자로 여겨지는 전 세계 가톨릭 교회의 목자입니다."
      },
      {
        "term": "성인",
        "original": "Saint",
        "def": "거룩한 삶을 살아 교회가 공식적으로 공경하도록 선포한 사람입니다."
      }
    ],
    "faq": [
      {
        "q": "신자가 아니어도 미사에 가도 되나요?",
        "a": "누구나 참석할 수 있습니다. 앉고 서는 때는 주변을 따라 하면 되고, 영성체(성체를 받는 것)는 세례받은 신자만 하므로 그때는 자리에 앉아 있거나 팔을 가슴에 X자로 모으고 나가 축복을 받을 수 있습니다."
      },
      {
        "q": "성모 마리아를 신으로 모시나요?",
        "a": "아닙니다. 하느님께 드리는 흠숭과 달리, 성모와 성인에게는 공경을 드립니다. 신앙의 모범으로 존경하며 전구(대신 기도해 주심)를 청합니다."
      },
      {
        "q": "고해성사는 어떻게 하나요?",
        "a": "세례받은 신자가 사제에게 죄를 고백하고 용서를 받는 성사입니다. 처음이라면 사제에게 처음이라고 말하면 안내해 줍니다. 고백 내용은 사제가 절대 밝힐 수 없습니다."
      }
    ],
    "quiz": [
      {
        "q": "천주교의 성사는 모두 몇 가지인가요?",
        "options": [
          "일곱 가지",
          "두 가지",
          "다섯 가지"
        ],
        "answer": 0,
        "explain": "세례·견진·성체·고해·병자·성품·혼인성사입니다.",
        "lesson": "p2"
      },
      {
        "q": "감실등이 켜져 있으면 감실에 성체가 모셔져 있다는 뜻이다.",
        "options": [
          "O",
          "X"
        ],
        "answer": 0,
        "explain": "감실등은 성체가 계심을 알리는 등입니다.",
        "lesson": "p3"
      },
      {
        "q": "천주교에서 성모 마리아는 하느님과 같이 흠숭의 대상이다.",
        "options": [
          "O",
          "X"
        ],
        "answer": 1,
        "explain": "성모는 공경의 대상이며, 흠숭은 하느님께만 드립니다.",
        "lesson": "p1"
      },
      {
        "q": "한국 천주교가 시작된 해로 꼽는 해는?",
        "options": [
          "1784년",
          "1592년",
          "1885년"
        ],
        "answer": 0,
        "explain": "이승훈이 베이징에서 세례를 받고 돌아온 1784년입니다."
      }
    ],
    "status": "checking",
    "festivals": [
      {
        "name": "주님 성탄 대축일",
        "when": "12월 25일",
        "text": "예수의 탄생."
      },
      {
        "name": "천주의 성모 마리아 대축일",
        "when": "1월 1일",
        "text": "마리아가 하느님의 어머니임을 기념."
      },
      {
        "name": "주님 부활 대축일",
        "when": "춘분 뒤 첫 보름 다음 주일",
        "text": "예수의 부활."
      },
      {
        "name": "성모 승천 대축일",
        "when": "8월 15일",
        "text": "마리아가 하늘에 올림을 받음."
      },
      {
        "name": "한국 순교자 대축일",
        "when": "9월 20일",
        "text": "한국의 순교 성인들을 기림."
      },
      {
        "name": "위령의 날",
        "when": "11월 2일",
        "text": "세상을 떠난 이들을 위해 기도."
      }
    ],
    "festivalNote": "올해의 정확한 날짜와 지금의 전례 시기는 본당의 \"전례력\"에서 볼 수 있습니다.",
    "sources": [
      "한국천주교주교회의 가톨릭 정보",
      "가톨릭 교회 교리서",
      "Encyclopaedia Britannica, \"Roman Catholicism\""
    ]
  },
  "en": {
    "title": "Catholicism",
    "sub": "The universal Church · sacraments and liturgy",
    "intro": "\"Catholic\" means universal: the Church continuing from the apostles, united around the Pope. Korean Catholicism began unusually with lay people, when Yi Seung-hun returned from baptism in Beijing in 1784; 103 Korean martyrs were canonised in 1984.",
    "start": {
      "title": "Your first cathedral visit",
      "text": "Make the sign of the cross with holy water, then visit the nave, altar, votive candles and Stations of the Cross.",
      "place": "gothic"
    },
    "lessons": [
      {
        "id": "believe",
        "title": "What Catholics believe",
        "body": [
          "The Triune God — Father, Son and Holy Spirit — and the death and resurrection of Jesus Christ.",
          "Sacred Tradition is held together with Scripture.",
          "The Catholic Bible has 73 books: 46 Old Testament and 27 New Testament."
        ]
      },
      {
        "id": "sacraments",
        "title": "The seven sacraments",
        "body": [
          "Baptism, Confirmation, Eucharist, Penance, Anointing of the Sick, Holy Orders and Matrimony.",
          "Sacraments are received in person through a priest; they cannot be received in a virtual space."
        ]
      },
      {
        "id": "mass",
        "title": "The Mass",
        "body": [
          "The Mass centres on the Liturgy of the Word and the Liturgy of the Eucharist, framed by introductory and concluding rites.",
          "Communion is received by baptised Catholics. Others may remain seated or come forward with arms crossed for a blessing."
        ]
      },
      {
        "id": "mary",
        "title": "Mary and the saints",
        "body": [
          "Catholics honour Mary, mother of Jesus, and the saints, asking their intercession.",
          "Worship (latria) is for God alone; Mary and the saints receive veneration."
        ]
      },
      {
        "id": "space",
        "title": "The church space",
        "body": [
          "The altar is the centre of the Mass; the tabernacle holds the Blessed Sacrament, with a lamp always lit.",
          "A cathedral holds the bishop's chair; not every church is a cathedral. Seoul's is Myeongdong Cathedral.",
          "Gothic: pointed arches, high vaults, great stained glass. Romanesque: round arches and thick walls."
        ]
      }
    ],
    "etiquette": [
      "On entering, make the sign of the cross with holy water (optional for non-Catholics).",
      "Bow toward the tabernacle.",
      "Keep quiet and avoid photos during Mass.",
      "Only Catholics receive Communion.",
      "The confessional is for the sacrament; do not enter casually."
    ],
    "practice": [
      {
        "label": "Light a candle",
        "place": "grotto",
        "text": "Light a votive candle at the Marian grotto."
      },
      {
        "label": "The Rosary",
        "place": "grotto",
        "text": "Pray the Rosary with today's mysteries."
      },
      {
        "label": "Stations of the Cross",
        "place": "gothic",
        "text": "Reflect on the Passion through 14 stations."
      },
      {
        "label": "Liturgical calendar",
        "place": "parish",
        "text": "See the current season and coming feasts."
      }
    ],
    "activities": [
      {
        "name": "Votive candle",
        "text": "Lighting a candle to offer a prayer to God.",
        "meaning": "The flame recalls the light of Christ and the wish that the prayer continues after you leave.",
        "steps": [
          "Pause in front of the stand.",
          "Take the flame from a lit candle to light a new one.",
          "Offer your intention silently.",
          "Make the sign of the cross and step back."
        ],
        "img": "gothic",
        "place": "gothic"
      },
      {
        "name": "The Rosary",
        "text": "Praying the Our Father and Hail Mary bead by bead.",
        "meaning": "A meditation on the life of Christ with Mary, in the Joyful, Luminous, Sorrowful and Glorious mysteries.",
        "steps": [
          "Holding the crucifix, make the sign of the cross and pray the Creed.",
          "Each decade: one Our Father, ten Hail Marys, one Glory Be.",
          "Reflect on the mystery of each decade.",
          "Close with the Hail, Holy Queen."
        ],
        "img": "grotto",
        "place": "grotto"
      },
      {
        "name": "Stations of the Cross",
        "text": "Walking the 14 stations of Christ’s Passion in prayer.",
        "meaning": "Rooted in the pilgrim way in Jerusalem, prayed especially on Fridays in Lent.",
        "steps": [
          "Begin at the First Station (condemned to death).",
          "Look at each scene and reflect.",
          "Say a short prayer and move on.",
          "End at the Fourteenth (laid in the tomb)."
        ],
        "img": "gothic",
        "place": "gothic"
      },
      {
        "name": "Liturgical year",
        "text": "Advent, Christmas, Lent, Easter and Ordinary Time.",
        "meaning": "The Church keeps the life of Christ through the year; vestment colours (violet, white, green, red) change with the season.",
        "steps": [
          "Find which season it is.",
          "Follow the prayers and readings for it.",
          "Attend Mass on Sundays and holy days of obligation."
        ],
        "img": "parish",
        "place": "parish"
      },
      {
        "name": "Bible reading",
        "text": "Reading and reflecting on the day’s Mass readings.",
        "meaning": "Catholics treasure Scripture together with Tradition. Lectio Divina is an ancient way of reading.",
        "steps": [
          "Lectio: read slowly.",
          "Meditatio: dwell on a word that stays with you.",
          "Oratio: answer in prayer.",
          "Contemplatio: rest silently in God."
        ],
        "img": "parish"
      }
    ],
    "figures": [
      {
        "name": "Jesus Christ",
        "text": "The Son in the Holy Trinity, believed to have become human to save humankind."
      },
      {
        "name": "The Virgin Mary",
        "text": "Mother of Jesus, honoured as the model of faith, not worshipped as God."
      },
      {
        "name": "The Pope",
        "text": "Bishop of Rome, held to be the successor of Saint Peter and shepherd of the worldwide Church."
      },
      {
        "name": "The crucifix",
        "text": "A cross bearing the figure of Christ, recalling his sacrifice; placed on or near the altar."
      },
      {
        "name": "Tabernacle and sanctuary lamp",
        "text": "Where the Eucharist is kept; a lit red lamp shows it is present."
      }
    ],
    "scriptures": [
      {
        "name": "The Catholic Bible (73 books)",
        "text": "46 Old Testament and 27 New Testament books, including deuterocanonical books such as Tobit, Judith and Maccabees."
      },
      {
        "name": "Catechism of the Catholic Church",
        "text": "The official 1992 summary of faith, sacraments, commandments and prayer."
      },
      {
        "name": "Council documents and encyclicals",
        "text": "Documents of the Second Vatican Council (1962–1965) and papal encyclicals apply Church teaching today."
      }
    ],
    "symbols": [
      {
        "name": "The altar",
        "text": "The table where the Liturgy of the Eucharist is celebrated."
      },
      {
        "name": "Tabernacle and lamp",
        "text": "Where the Eucharist is kept; a red lamp shows it is present."
      },
      {
        "name": "The crucifix",
        "text": "A cross bearing the figure of Christ, on or near the altar."
      },
      {
        "name": "Holy water font",
        "text": "Signing oneself with holy water at the door recalls baptism."
      },
      {
        "name": "Statue of Mary",
        "text": "Honoured beside the altar or in a Marian grotto."
      }
    ],
    "culture": [
      {
        "name": "Sunday Mass",
        "text": "Catholics are obliged to attend Mass on Sundays and holy days."
      },
      {
        "name": "Baptismal names",
        "text": "A saint’s name is taken at baptism as a patron."
      },
      {
        "name": "Retreats and pilgrimage",
        "text": "Retreats for prayer and pilgrimages to martyrs’ shrines are popular."
      }
    ],
    "glossary": [
      {
        "term": "Mass",
        "original": "Missa (Latin)",
        "def": "The central Catholic worship of the Word and the Eucharist."
      },
      {
        "term": "Sacrament",
        "original": "Sacramentum",
        "def": "Seven signs of God’s grace: baptism, confirmation, Eucharist, penance, anointing, holy orders, matrimony."
      },
      {
        "term": "Eucharist",
        "original": "",
        "def": "The bread consecrated at Mass, believed to be the Body of Christ."
      },
      {
        "term": "Rosary",
        "original": "",
        "def": "A string of beads used to pray the Rosary."
      },
      {
        "term": "Liturgy",
        "original": "",
        "def": "The public worship of the Church and its forms."
      },
      {
        "term": "Pope",
        "original": "",
        "def": "Bishop of Rome and successor of Saint Peter, shepherd of the worldwide Church."
      },
      {
        "term": "Saint",
        "original": "",
        "def": "A person of holy life whom the Church officially honours."
      }
    ],
    "faq": [
      {
        "q": "Can I attend Mass if I am not Catholic?",
        "a": "Anyone may attend. Follow others in sitting and standing. Communion is for baptised Catholics; you may stay seated or come forward with arms crossed over your chest for a blessing."
      },
      {
        "q": "Do Catholics worship Mary?",
        "a": "No. Worship is for God alone; Mary and the saints are honoured as models of faith and asked to pray for us."
      },
      {
        "q": "How does confession work?",
        "a": "A baptised Catholic confesses sins to a priest and receives absolution. Tell the priest it is your first time and he will guide you; he may never reveal what is said."
      }
    ],
    "quiz": [
      {
        "q": "How many sacraments are there in the Catholic Church?",
        "options": [
          "Seven",
          "Two",
          "Five"
        ],
        "answer": 0,
        "explain": "Baptism, confirmation, Eucharist, penance, anointing of the sick, holy orders and matrimony.",
        "lesson": "sacraments"
      },
      {
        "q": "A lit sanctuary lamp means the Eucharist is kept in the tabernacle.",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explain": "The lamp signals the presence of the Eucharist.",
        "lesson": "space"
      },
      {
        "q": "Catholics worship Mary as they worship God.",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explain": "Mary is honoured; worship is for God alone.",
        "lesson": "mary"
      },
      {
        "q": "Which year is taken as the beginning of the Korean Catholic Church?",
        "options": [
          "1784",
          "1592",
          "1885"
        ],
        "answer": 0,
        "explain": "1784, when Yi Seung-hun returned from baptism in Beijing.",
        "lesson": "believe"
      }
    ],
    "status": "checking",
    "festivals": [
      {
        "name": "Christmas",
        "when": "25 December",
        "text": "The birth of Jesus."
      },
      {
        "name": "Mary, Mother of God",
        "when": "1 January",
        "text": "Mary as Mother of God."
      },
      {
        "name": "Easter Sunday",
        "when": "Sunday after the first full moon after the equinox",
        "text": "The resurrection."
      },
      {
        "name": "Assumption",
        "when": "15 August",
        "text": "Mary taken up into heaven."
      },
      {
        "name": "Korean Martyrs",
        "when": "20 September",
        "text": "Honouring Korea's martyr saints."
      },
      {
        "name": "All Souls",
        "when": "2 November",
        "text": "Prayer for the departed."
      }
    ],
    "festivalNote": "See the parish \"Liturgical calendar\" for this year's exact dates and current season.",
    "sources": [
      "Catholic Bishops' Conference of Korea",
      "Catechism of the Catholic Church",
      "Encyclopaedia Britannica, \"Roman Catholicism\""
    ]
  }
}

export default pack
