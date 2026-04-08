export function CloseIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg
      fill="none"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M6 6L18 18M6 18L18 6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
