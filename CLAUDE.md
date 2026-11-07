# 믿어보까 — 작업 규칙 (CLAUDE.md)

교회·성당·사찰·힌두 사원을 3D로 걸어 다니며 둘러보는 입문 안내 서비스. 특정 종교를 권하지 않고 중립을 지킨다.
React 19 + TS + Vite, three.js(`src/engine/stage.ts`), 해시 라우터(`#/...`). 배포: mideobogga.pages.dev, 앱인토스(믿어보까).

## 꼭 지킬 것
- 저장 키 `oruvia-v1`(store)은 바꾸지 않는다 (기존 사용자 기록이 사라짐)
- `.env*`, 키스토어(`*.jks`, `keystore.properties`), 토큰은 커밋하지 않는다
- 기존 기능을 지우거나 임의로 단순화하지 않는다. 바꾸기 전후를 실제 브라우저에서 비교한다
- 앱인토스 모드(`IN_TOSS`, `html[data-toss='1']`)에서는 상단바·뒤로 가기 버튼을 숨긴다 (토스 내비와 중복되면 반려됨)

## 3D 작업 규칙 (그래픽 퀄리티 기준)
참고 구현: `src/worlds/plaza/three.ts` (믿어보까 광장)

**분위기를 먼저 정한다.** 예: "해 질 녘, 고요하고 성스럽게, 은은하게". 쨍하고 화려한 것보다 빛이 부드럽게 번지는 쪽.

**방법**
- 하늘·배경: 그라데이션 하늘(`sky`) + 안개(`scene.fog`) + 멀리 겹친 능선(`ridge`)으로 깊이감을 준다
- 조명: 따뜻한 주광 1개 + 반대쪽 차가운 보조광 + 반구광. 점광원(`ctx.pointLight`)은 2~3개만
- 빛 표현: 후처리(bloom 등)는 쓰지 않는다. 대신 `halo` 스프라이트, 가산 합성(AdditiveBlending) 빛판, 빛나는 창·문(MeshBasic), 떠다니는 빛 알갱이(Points)
- 재질: `src/engine/tex.ts`의 절차 텍스처(marble, stone, stainedGlass, roseWindow, dancheong 등)를 쓴다. 단색 박스를 그대로 두지 않는다
- 디테일: 테두리·띠·계단·장식처럼 작은 형태를 겹쳐 실루엣을 풍부하게. 물체 밑에 `blob()` 그림자
- 움직임: 빛·등·고리가 숨 쉬듯 천천히 (sin으로 아주 약하게)
- `src/engine/props.ts` 부품을 재사용하고, 기존 동선·충돌(`walk`/`block`)·안내 지점(`spot`)은 건드리지 않는다
- 성능: Lambert 재질 유지, 재질은 공유, 모바일에서도 돌아가야 한다 (`ctx.high`로 개수 조절)

**검증 (생략하지 않는다)**
1. `npx vite build` 후 `npx vite preview`, Playwright로 PC(1280x800)와 아이폰 크기 스크린샷을 여러 각도로 찍는다
   (WebGL: `chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })`, 주소에 `?debug`를 붙이면 `window.__stage`로 이동 테스트 가능)
2. 스크린샷을 직접 보고 "너무 밝음 / 밋밋함 / 겹침 / 카메라가 벽에 묻힘 / 글씨 안 보임"을 찾아 고친다
3. 찍고 고치기를 최소 2번 반복하고, 최종 스크린샷을 사용자에게 보여 준다

## 배포
- 웹: `.\deploy.ps1` (PowerShell에서 npm이 막히면 `npm.cmd`)
- 앱인토스: 웹 배포와 별개. `npm run build:toss` → `mideobogga.ait`를 앱인토스 콘솔에 새 버전으로 올리고 검수를 받아야 반영된다
