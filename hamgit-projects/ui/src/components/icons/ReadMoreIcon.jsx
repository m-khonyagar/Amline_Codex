export function ReadMoreIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...props}
    >
      <path
        d="M16.55 17.4508L17.95 16.0508L14.925 13.0008H22V11.0008H14.925L17.95 7.95078L16.55 6.55078L11.1 12.0008L16.55 17.4508ZM11 17.0008V15.0008H2V17.0008H11ZM11 9.00078V7.00078H2V9.00078H11ZM8 13.0008V11.0008H2V13.0008H8Z"
        fill={color}
      />
    </svg>
  )
}
