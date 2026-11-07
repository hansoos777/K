// 벌레 빠지직을 토스 앱 안(앱인토스 WebView 미니앱)으로 올리기 위한 설정.
// `npm run build` → 이 폴더에 bugsbbazizig.ait 생성 → 앱인토스 콘솔 '앱 번들'에 올린다.
// appName은 앱인토스 콘솔에서 앱을 만들 때 정한 앱 ID(영문)와 같아야 한다.
import { defineConfig } from '@apps-in-toss/web-framework/config'

export default defineConfig({
  appName: 'bugsbbazizig',
  brand: {
    // 경고 테이프 노란색(게임 강조색)
    primaryColor: '#FFC928',
  },
  // 카메라·위치·사진 같은 권한은 쓰지 않음
  permissions: [],
  navigationBar: {
    withBackButton: true,
    withHomeButton: true,
    withTitle: true,
    // 게임 화면이 어두워서 상단 바도 어둡게
    theme: 'dark',
  },
  webView: {
    // 벌레를 문지르고 끌 때 화면이 튕기거나 새로고침되지 않게
    bounces: false,
    pullToRefreshEnabled: false,
    overScrollMode: 'never',
    allowsBackForwardNavigationGestures: false,
    // 효과음(Web Audio)
    allowsInlineMediaPlayback: true,
    mediaPlaybackRequiresUserAction: false,
  },
  webBundleDir: 'dist',
})
