// 토스 앱 안(앱인토스 WebView 미니앱)으로 올리기 위한 설정. `npm run build:toss` → 프로젝트 맨 위에 mideobogga.ait 생성
// 앱인토스 콘솔에 등록한 앱 이름과 appName이 같아야 한다.
import { defineConfig } from '@apps-in-toss/web-framework/config'

export default defineConfig({
  appName: 'mideobogga',
  brand: {
    // 버튼 갈색과 같은 색
    primaryColor: '#7A6652',
  },
  // 카메라·위치 같은 권한은 쓰지 않음
  permissions: [],
  navigationBar: {
    withBackButton: true,
    withHomeButton: true,
    withTitle: true,
    theme: 'light',
  },
  webView: {
    // 3D 공간 안에서 끌어 둘러볼 때 화면 전체가 튕기거나 새로고침되지 않게
    bounces: false,
    pullToRefreshEnabled: false,
    overScrollMode: 'never',
    allowsBackForwardNavigationGestures: false,
    // 3D 공간의 효과음·음악(Web Audio)
    allowsInlineMediaPlayback: true,
    mediaPlaybackRequiresUserAction: false,
  },
  webBundleDir: 'dist',
})
