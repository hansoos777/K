import { useEffect, useState } from 'react'

export function AvatarPicker({ value, onPick }: { value: number; onPick: (i: number) => void }) {
  const [thumbs, setThumbs] = useState<string[]>([])

  useEffect(() => {
    let alive = true
    import('../three/thumbs').then(({ avatarThumbs }) => {
      if (alive) setThumbs(avatarThumbs())
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="avatars">
      {thumbs.map((src, i) => (
        <button key={i} className={value === i ? 'on' : ''} aria-pressed={value === i} aria-label={String(i + 1)} onClick={() => onPick(i)}>
          <img src={src} alt="" />
        </button>
      ))}
    </div>
  )
}
