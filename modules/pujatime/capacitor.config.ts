import type { CapacitorConfig } from '@capacitor/cli'

// 골목기사와 같은 방식: 앱 안에 사이트를 묶지 않고 배포된 사이트를 그대로 띄움.
// 웹만 배포하면 설치된 앱에도 바로 반영되고, 스토어 재심사는 아이콘·권한·네이티브 플러그인을
// 바꿀 때만 필요함. webDir은 형식상 필요한 값이고 server.url이 있으면 쓰이지 않음.
const config: CapacitorConfig = {
  appId: 'com.chilbokpapa.pujatime',
  appName: 'PujaTime',
  webDir: 'dist',
  server: {
    url: 'https://pujatime.pages.dev',
    cleartext: false,
  },
  plugins: {
    LocalNotifications: { smallIcon: 'ic_stat_notify', iconColor: '#E8590C' },
  },
}

export default config
