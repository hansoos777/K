// 토스 앱 안에서만 쓰는 연결: 토스 게임센터 리더보드
// 빌드할 때 dist/js/toss-bridge.js 하나로 묶여 index.html에서 게임보다 먼저 읽힌다.
// 게임(main.js)은 window.__tossGame 이 있을 때만 이 기능을 쓴다(웹사이트에서는 없음).
import { Game } from '@apps-in-toss/web-framework'

const ok = (fn) => { try { return !!fn.isSupported() } catch { return false } }

window.__tossGame = {
  /** 이 토스 앱 버전에서 리더보드를 쓸 수 있나 */
  canRank: () => ok(Game.setLeaderboardScore) && ok(Game.openLeaderboard),
  /** 점수 올리기. 결과 코드(SUCCESS 등)를 돌려준다 */
  async submit(score) {
    try {
      const r = await Game.setLeaderboardScore({ score: String(Math.max(0, Math.round(score))) })
      return r ? r.statusCode : 'NO_RESPONSE'
    } catch (e) { return 'ERROR' }
  },
  /** 토스 게임센터 리더보드 화면 열기 */
  async open() { try { await Game.openLeaderboard() } catch { /* 열지 못해도 게임은 계속 */ } },
}
