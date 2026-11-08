# 벌레 빠지직 — 앱인토스(토스 앱 안 미니앱)

게임 본체는 `../bugsmash`에 있고, 이 폴더는 그것을 토스용 `.ait` 번들로 묶기만 합니다.

```bash
cd games/bugsmash-toss
npm install
npm run build        # → bugsbbazizig.ait
```

`npm run build`가 하는 일:

1. `scripts/build.mjs`가 `../bugsmash`를 `dist/`로 복사합니다.
   - 서비스 워커(`sw.js`), 앱 설치용 manifest, 문서와 도구는 뺍니다.
   - `index.html`에 `window.__TOSS__ = true`를 넣습니다. 그러면 게임이 설치 안내를 숨기고 서비스 워커를 쓰지 않습니다.
   - `src/bridge.js`(토스 게임센터 리더보드)를 esbuild로 `dist/js/toss-bridge.js` 하나로 묶어 게임보다 먼저 읽히게 합니다.
2. `ait build`가 `dist/`를 `bugsbbazizig.ait`로 묶습니다.

## 리더보드

60초 도전이 끝나면 점수를 토스 게임센터 리더보드에 올리고(`Game.setLeaderboardScore`),
결과 화면과 메뉴의 **순위 보기** 버튼이 리더보드를 엽니다(`Game.openLeaderboard`).
토스 앱 안에서, 리더보드를 지원하는 토스 버전(5.221.0 이상)일 때만 버튼이 보입니다.
콘솔 설정: 점수 단위 점 / points, 정렬 높은 점수부터.

만든 `.ait` 파일은 앱인토스 콘솔 → 앱 등록하기 → **앱 번들**에 올립니다.
`apps-in-toss.config.ts`의 `appName`(`bugsbbazizig`)은 콘솔에서 앱을 만들 때 정한 앱 ID와 같아야 합니다.

글꼴은 게임 안에 들어 있어서(`../bugsmash/fonts`) 외부 요청이 없습니다.
게임을 고친 뒤에는 `npm run build`를 다시 돌려 새 `.ait`를 만드세요.
