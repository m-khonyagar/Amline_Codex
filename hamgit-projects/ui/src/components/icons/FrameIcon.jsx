export function FrameIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...props}
    >
      <path d="M5 1H3C1.89543 1 1 1.89543 1 3V5" stroke={color} strokeLinecap="round" />
      <path
        d="M11 15L13 15C14.1046 15 15 14.1046 15 13L15 11"
        stroke={color}
        strokeLinecap="round"
      />
      <path d="M15 5L15 3C15 1.89543 14.1046 1 13 1L11 1" stroke={color} strokeLinecap="round" />
      <path d="M1 11L1 13C1 14.1046 1.89543 15 3 15L5 15" stroke={color} strokeLinecap="round" />
    </svg>
  )
}
