export function CircleCheckBoldIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg
      fill={color}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="10" fill={color} />
      <path d="M7.26562 11.4723L10.4235 14.6302L16.7393 8.31445" stroke="white" strokeWidth="2" />
    </svg>
  )
}
