export function DocumentBoldIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg
      fill={color}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M8 2H18C19.6569 2 21 3.34315 21 5V20C21 21.6569 19.6569 23 18 23H6C4.34315 23 3 21.6569 3 20V7L8 2Z" />
      <path
        d="M8 2H18C19.6569 2 21 3.34315 21 5V20C21 21.6569 19.6569 23 18 23H6C4.34315 23 3 21.6569 3 20V7M8 2L3 7M8 2V6C8 6.55228 7.55228 7 7 7H3"
        stroke="white"
        strokeWidth="1.5"
      />
      <path
        d="M7.5 10H16.5M7.5 13.5H16.5M12 17H16.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
