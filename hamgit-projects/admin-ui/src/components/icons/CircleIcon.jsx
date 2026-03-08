export function CircleIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg
      fill={color}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 21C7 21 3 17 3 12C3 7 7 3 12 3C17 3 21 7 21 12C21 17 17 21 12 21ZM12 5C8.1 5 5 8.1 5 12C5 15.9 8.1 19 12 19C15.9 19 19 15.9 19 12C19 8.1 15.9 5 12 5Z" />
    </svg>
  )
}
