export function TablerArrowBack({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg
      fill="none"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 10L5 14M5 14L9 18M5 14H16C17.0609 14 18.0783 13.5786 18.8284 12.8284C19.5786 12.0783 20 11.0609 20 10C20 8.93913 19.5786 7.92172 18.8284 7.17157C18.0783 6.42143 17.0609 6 16 6H15"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
