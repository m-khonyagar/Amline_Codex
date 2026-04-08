export function ThreeDotsIcon({ color = 'currentColor', ...props }) {
  return (
    <svg
      width={4}
      height={18}
      viewBox="0 0 4 18"
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      {...props}
    >
      <circle cx="2" cy="2" r="2" fill="currentColor" />
      <circle cx="2" cy="8.75" r="2" fill="currentColor" />
      <circle cx="2" cy="15.5" r="2" fill="currentColor" />
    </svg>
  )
}
