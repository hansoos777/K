// 화면 틀. index.html과 미리보기 페이지가 같은 마크업을 쓰도록 여기 한 곳에 둔다.
export const MARKUP = `
<div id="stage">
  <canvas id="cv-bg"></canvas>
  <canvas id="cv-decal"></canvas>
  <canvas id="cv-main"></canvas>
  <canvas id="cv-glass"></canvas>
</div>

<header id="hud" hidden>
  <button id="b-pause" class="icon-btn" type="button" aria-label="일시정지">
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1.2" fill="currentColor"/></svg>
  </button>
  <div class="hud-info"><span id="h-mode"></span><strong id="h-main"></strong></div>
  <div class="hud-score"><span id="h-score">0</span><small>점</small></div>
</header>

<aside id="tools" hidden>
  <button id="b-summon" type="button">벌레<br>부르기</button>
  <button id="b-clean" type="button">바닥<br>청소</button>
  <button id="b-glass" type="button">유리<br>갈기</button>
</aside>

<div id="summon" class="sheet" hidden>
  <div class="sheet-head"><b>벌레 부르기</b><button id="sum-close" class="x" type="button" aria-label="닫기">✕</button></div>
  <div id="sum-list" class="sum-grid"></div>
  <div class="sheet-foot">
    <button id="sum-swarm" type="button" class="btn warn">바퀴벌레 떼 부르기</button>
    <label class="tog"><input id="sum-auto" type="checkbox"> 계속 나오게</label>
  </div>
</div>

<nav id="dock" hidden aria-label="무기"></nav>
<div id="toast" hidden></div>

<section id="s-menu" class="screen">
  <div class="card menu">
    <div class="tape" aria-hidden="true"><span>해충 박멸 작전 · 해충 박멸 작전 · 해충 박멸 작전 · 해충 박멸 작전 ·</span></div>
    <h1 class="logo"><span>벌레</span><span>빠지직</span></h1>
    <p class="tag">스트레스는 시원하게 풀고, 벌레 공포증은 한 단계씩 이겨내요.</p>

    <div class="modes">
      <button class="mode" data-mode="maps" type="button">
        <span class="mt" id="t-maps"></span>
        <span class="mx"><b>스테이지</b><small>거실 → 하수구 → 폐건물 → 밀림 → 벌레 소굴 · <em id="m-maps">0/5</em></small></span>
      </button>
      <button class="mode" data-mode="free" type="button">
        <span class="mt" id="t-free"></span>
        <span class="mx"><b>자유 모드</b><small>시간 제한 없이 마음껏. 벌레를 직접 불러서 잡아요.</small></span>
      </button>
      <button class="mode" data-mode="challenge" type="button">
        <span class="mt" id="t-chal"></span>
        <span class="mx"><b>60초 도전</b><small>도망가기 전에 잡아요 · 최고 <em id="m-best">0</em></small></span>
      </button>
      <button class="mode" data-mode="course" type="button">
        <span class="mt" id="t-course"></span>
        <span class="mx"><b>공포 극복 코스</b><small>귀여운 개미부터 진짜 같은 바퀴벌레까지 · <em id="m-course">0/7</em></small></span>
      </button>
    </div>

    <div class="field">
      <div class="label">벌레 모습</div>
      <div class="seg" id="seg-style" role="group" aria-label="벌레 모습">
        <button type="button" data-v="1"><span class="st"></span>귀여움</button>
        <button type="button" data-v="2"><span class="st"></span>만화</button>
        <button type="button" data-v="3"><span class="st"></span>리얼</button>
      </div>
      <p id="style-desc" class="desc"></p>
    </div>
    <div class="field">
      <div class="label">난이도</div>
      <div class="seg flat" id="seg-diff" role="group" aria-label="난이도">
        <button type="button" data-v="1">하</button>
        <button type="button" data-v="2">중</button>
        <button type="button" data-v="3">상</button>
      </div>
      <p id="diff-desc" class="desc"></p>
    </div>
    <div class="field">
      <div class="label">바닥</div>
      <div class="seg flat" id="seg-bg" role="group" aria-label="바닥">
        <button type="button" data-v="floor">나무 마루</button>
        <button type="button" data-v="tile">주방 타일</button>
        <button type="button" data-v="screen">컴퓨터 화면</button>
        <button type="button" data-v="sewer">하수구</button>
        <button type="button" data-v="ruin">폐건물</button>
        <button type="button" data-v="jungle">밀림</button>
      </div>
    </div>

    <div class="row">
      <button id="b-records" class="btn ghost" type="button">처치 기록</button>
      <button id="b-sound" class="btn ghost" type="button" aria-pressed="true">소리 켬</button>
      <button id="b-vibe" class="btn ghost" type="button" aria-pressed="true">진동 켬</button>
      <button id="b-install" class="btn" type="button" hidden>앱으로 설치</button>
    </div>
    <p id="ios-hint" class="desc small" hidden>아이폰: 공유 버튼 → 홈 화면에 추가 하면 앱처럼 쓸 수 있어요.</p>
  </div>
</section>

<section id="s-maps" class="screen" hidden>
  <div class="card">
    <div class="eyebrow">스테이지</div>
    <h2>맵을 하나씩 깨요</h2>
    <p class="desc">맵마다 3웨이브와 보스가 나와요. 벌레가 도망가면 하트가 하나씩 줄고, 5개를 다 잃으면 실패예요.</p>
    <div id="map-list" class="stages"></div>
    <div class="row"><button class="btn ghost" data-back type="button">메뉴로</button></div>
  </div>
</section>

<section id="s-mapintro" class="screen" hidden>
  <div class="card center">
    <div class="eyebrow" id="mi-step"></div>
    <h2 id="mi-title"></h2>
    <div id="mi-prev" class="mapprev"></div>
    <p id="mi-desc" class="desc"></p>
    <div id="mi-bugs" class="chips"></div>
    <div id="mi-boss" class="chips boss"></div>
    <p id="mi-tip" class="desc small"></p>
    <div class="row">
      <button id="mi-back" class="btn ghost" type="button">맵 목록</button>
      <button id="mi-start" class="btn big" type="button">시작</button>
    </div>
  </div>
</section>

<section id="s-mapend" class="screen" hidden>
  <div class="card center">
    <div class="eyebrow" id="me-step"></div>
    <h2 id="me-title"></h2>
    <div id="me-stars" class="stars"></div>
    <p id="me-msg" class="desc"></p>
    <dl id="me-stats" class="stats"></dl>
    <div class="row">
      <button id="me-menu" class="btn ghost" type="button">메뉴로</button>
      <button id="me-again" class="btn ghost" type="button">다시 하기</button>
      <button id="me-next" class="btn big" type="button">다음 맵</button>
    </div>
  </div>
</section>

<section id="s-course" class="screen" hidden>
  <div class="card">
    <div class="eyebrow">공포 극복 코스</div>
    <h2>한 단계씩, 천천히</h2>
    <p class="desc">단계가 올라갈수록 벌레가 조금씩 진짜처럼 보여요. 무서우면 언제든 일시정지하면 화면이 흐려져요.</p>
    <div id="course-list" class="stages"></div>
    <div class="row"><button class="btn ghost" data-back type="button">메뉴로</button></div>
  </div>
</section>

<section id="s-intro" class="screen" hidden>
  <div class="card center">
    <div class="eyebrow" id="i-step"></div>
    <h2 id="i-title"></h2>
    <div class="look">모습: <b id="i-look"></b></div>
    <div id="i-bugs" class="chips"></div>
    <p id="i-tip" class="desc"></p>
    <p class="desc small">시작하기 전에 숨을 한 번 크게 쉬어요.</p>
    <div class="row">
      <button id="i-back" class="btn ghost" type="button">단계 목록</button>
      <button id="i-start" class="btn big" type="button">시작</button>
    </div>
  </div>
</section>

<section id="s-clear" class="screen" hidden>
  <div class="card center">
    <div class="eyebrow" id="c-step"></div>
    <h2 id="c-title"></h2>
    <p id="c-msg" class="desc"></p>
    <div class="row">
      <button id="c-menu" class="btn ghost" type="button">메뉴로</button>
      <button id="c-again" class="btn ghost" type="button">한 번 더</button>
      <button id="c-next" class="btn big" type="button">다음 단계</button>
    </div>
  </div>
</section>

<section id="s-pause" class="screen" hidden>
  <div class="card center">
    <div class="eyebrow">일시정지</div>
    <h2>잠깐 쉬어요</h2>
    <p class="desc">화면을 흐리게 가렸어요. 숨 한 번 크게 쉬고 돌아오세요.</p>
    <div class="row col">
      <button id="p-resume" class="btn big" type="button">계속하기</button>
      <button id="p-restart" class="btn ghost" type="button">처음부터</button>
      <button id="p-menu" class="btn ghost" type="button">메뉴로</button>
    </div>
  </div>
</section>

<section id="s-result" class="screen" hidden>
  <div class="card center">
    <div class="eyebrow">60초 도전 결과</div>
    <div class="grade" id="r-grade">A</div>
    <div class="score"><span id="r-score">0</span><small>점</small></div>
    <div id="r-best" class="best"></div>
    <dl id="r-stats" class="stats"></dl>
    <div class="relief">
      <div class="relief-top"><span>스트레스 해소</span><b id="r-relief-v">0%</b></div>
      <div class="bar" id="r-relief"><i></i></div>
    </div>
    <div class="row">
      <button id="r-menu" class="btn ghost" type="button">메뉴로</button>
      <button id="r-again" class="btn big" type="button">다시 도전</button>
    </div>
  </div>
</section>

<section id="s-records" class="screen" hidden>
  <div class="card">
    <div class="eyebrow">처치 기록 · 이 기기에만 저장</div>
    <h2>지금까지 <span id="rec-total">0</span>마리</h2>
    <div id="rec-list" class="recs"></div>
    <dl class="stats">
      <div><dt>제일 많이 쓴 무기</dt><dd id="rec-fav"></dd></div>
      <div><dt>60초 최고 기록</dt><dd id="rec-best"></dd></div>
      <div><dt>공포 극복 코스</dt><dd id="rec-course"></dd></div>
      <div><dt>스테이지</dt><dd id="rec-maps"></dd></div>
    </dl>
    <div class="row"><button class="btn ghost" data-back type="button">메뉴로</button></div>
  </div>
</section>
`
