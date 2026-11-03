import type { DeityId } from '../data/deities'
import { SONG_KINDS, songsFor, type Song } from '../data/songs'
import { useT } from '../i18n'
import { playSong, useNowSong } from '../lib/songPlayer'
import { Note } from './Shared'

function SongRow({ song, tag }: { song: Song; tag?: string }) {
  const t = useT()
  const on = useNowSong() === song
  return (
    <button className="row song" disabled={!song.audio} aria-pressed={on} onClick={() => playSong(song)}>
      <span><strong>{song.title}</strong>{tag && <small>{tag}</small>}</span>
      <em>{!song.audio ? t.songSoon : on ? t.songStop : t.songPlay}</em>
    </button>
  )
}

function NowPlaying() {
  const t = useT()
  const song = useNowSong()
  if (!song) return null
  return <p className="song-now" role="status">{t.songNow} · {t.songKinds[song.kind]} · {song.title}</p>
}

/** 신의 찬가를 종류별로 보여 주고 원하는 곡을 고르게 함 */
export function SongList({ id }: { id: DeityId }) {
  const t = useT()
  const songs = songsFor(id)
  return (
    <div className="songs">
      <NowPlaying />
      {SONG_KINDS.filter((k) => songs.some((s) => s.kind === k)).map((k) => (
        <section key={k}>
          <p className="eyebrow">{t.songKinds[k]}</p>
          <div className="list">
            {songs.filter((s) => s.kind === k).map((s) => <SongRow key={s.title} song={s} />)}
          </div>
        </section>
      ))}
      <Note>{t.songNote}</Note>
    </div>
  )
}

/** 푸자 중에 보여 주는 지금 곡 또는 추천곡 */
export function SongPick({ id }: { id: DeityId }) {
  const t = useT()
  const now = useNowSong()
  const songs = songsFor(id)
  const song = songs.find((s) => s === now) ?? songs.find((s) => s.audio) ?? songs[0]
  if (!song) return null
  return (
    <div className="song-pick">
      <SongRow song={song} tag={`${t.songPick} · ${t.songKinds[song.kind]}`} />
    </div>
  )
}
