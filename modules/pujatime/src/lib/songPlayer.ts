import { useSyncExternalStore } from 'react'
import type { DeityId } from '../data/deities'
import { songsFor, type Song } from '../data/songs'
import { stopVoice, toggleVoice } from './ambient'
import { audioPrefs, isSoundOn } from './store'

// 화면이 바뀌어도 이어지도록 재생 중인 곡을 한곳에서 관리
let now: Song | null = null
const listeners = new Set<() => void>()

function setNow(song: Song | null) {
  now = song
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

export const useNowSong = () => useSyncExternalStore(subscribe, () => now)

/** 고른 곡을 재생. 같은 곡을 다시 누르면 멈춤 */
export function playSong(song: Song) {
  if (!song.audio) return
  setNow(toggleVoice(song.audio, () => setNow(null)) ? song : null)
}

export function stopSong() {
  stopVoice()
  setNow(null)
}

/** 신을 고르면 음원이 있는 첫 곡을 자동 재생. 소리나 음악을 끈 사람에게는 틀지 않음 */
export function autoSong(id: DeityId) {
  const song = songsFor(id).find((s) => s.audio)
  if (song && isSoundOn() && audioPrefs().track !== 'off') playSong(song)
}
