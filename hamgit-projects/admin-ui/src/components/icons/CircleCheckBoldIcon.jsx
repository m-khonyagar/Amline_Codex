export function CircleCheckBoldIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg
      fill={color}
      width={size}
      height={size}
      viewBox="0 0 19 19"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="9.5" cy="9.5" r="9.5" />
      <path d="M5 9L8 12L14 6" stroke="white" strokeWidth="2" />
    </svg>
  )
}
