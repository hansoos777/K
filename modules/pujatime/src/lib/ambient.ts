import { setDroneVolume, startDrone } from './sound'
import { audioPrefs } from './store'

// 앱 전체에 깔리는 배경 탄푸라. 브라우저는 사용자가 한 번 눌러야 소리를 허용함.
let stopDrone: (() => void) | null = null

export function playAmbient() {
  if (voice) return
  const { track, music } = audioPrefs()
  if (track === 'tanpura') {
    stopDrone ??= startDrone()
    setDroneVolume(music)
  } else stopAmbient()
}

export function stopAmbient() {
  stopDrone?.()
  stopDrone = null
}

let voice: HTMLAudioElement | null = null

/** 기도문 낭송을 재생. 다시 누르면 멈춤. 끝나면 onEnd 호출 */
export function toggleVoice(src: string, onEnd: () => void) {
  if (voice) {
    voice.pause()
    const same = voice.src.endsWith(src)
    voice = null
    onEnd()
    if (same) {
      playAmbient()
      return false
    }
  }
  // 음정이 다른 소리가 겹치지 않도록 낭송 중에는 배경음을 쉼
  stopAmbient()
  const finish = () => {
    voice = null
    onEnd()
    playAmbient()
  }
  voice = new Audio(src)
  voice.onended = finish
  void voice.play().catch(finish)
  return true
}

export function stopVoice() {
  if (!voice) return
  voice.pause()
  voice = null
  playAmbient()
}
