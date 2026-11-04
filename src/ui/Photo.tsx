import { useState } from 'react'

/**
 * 실사 사진(public/images, scripts/images/gen.mjs 로 PC에서 만듦)을 먼저 쓰고,
 * 아직 없으면 3D 공간 사진(public/photos)으로 대신 보여 준다.
 */
export function Photo({ src, fallback, alt = '', className, w, h, eager }: { src: string; fallback: string; alt?: string; className?: string; w?: number; h?: number; eager?: boolean }) {
  const [cur, setCur] = useState(src)
  return (
    <img
      src={cur}
      alt={alt}
      className={className}
      width={w}
      height={h}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      onError={() => cur !== fallback && setCur(fallback)}
    />
  )
}

export const img = (id: string) => `/images/${id}.webp`
/** 종교 대표 사진: 외관 실사 → 없으면 대표 3D 공간 */
export const EXT: Record<string, string> = { christian: 'ext_christian', catholic: 'ext_catholic', temple: 'ext_temple', mandir: 'ext_mandir' }
