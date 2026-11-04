/** 로고 A · 네 개의 빛: 네 종교를 뜻하는 네 빛이 가운데에서 만남 (어느 한 종교의 상징을 쓰지 않음) */
export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <g style={{ mixBlendMode: 'multiply' }}>
        <circle cx="20" cy="11.5" r="9" fill="#C9D3F2" />
        <circle cx="28.5" cy="20" r="9" fill="#F2D9B3" />
        <circle cx="20" cy="28.5" r="9" fill="#F5CDBF" />
        <circle cx="11.5" cy="20" r="9" fill="#CFE3D8" />
      </g>
      <circle cx="20" cy="20" r="3" fill="#4A3F36" />
    </svg>
  )
}

export default LogoMark

/** 예전 이름 호환(공간 불러오기 화면) */
export const Logo = LogoMark
