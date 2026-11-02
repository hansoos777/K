/** 오루비아 로고: 여러 빛이 하나의 원 안에 모이는 모양 (특정 종교 상징 아님) */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="20" cy="20" r="11" fill="none" stroke="currentColor" strokeWidth="1" opacity=".55" />
      {[0, 90, 180, 270].map((a) => (
        <path key={a} d="M20 4 L21.4 16 L20 18 L18.6 16 Z" fill="currentColor" transform={`rotate(${a} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="2.4" fill="currentColor" />
    </svg>
  )
}
