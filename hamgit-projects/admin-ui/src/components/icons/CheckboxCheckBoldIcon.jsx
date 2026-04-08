export function CheckboxCheckBoldIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg
      fill={color}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M18 3H6C4.3 3 3 4.3 3 6V18C3 19.7 4.3 21 6 21H18C19.7 21 21 19.7 21 18V6C21 4.3 19.7 3 18 3ZM16.7 9.7L10.7 15.7C10.5 15.9 10.2 16 10 16C9.8 16 9.5 15.9 9.3 15.7L7.3 13.7C6.9 13.3 6.9 12.7 7.3 12.3C7.7 11.9 8.3 11.9 8.7 12.3L10 13.6L15.3 8.3C15.7 7.9 16.3 7.9 16.7 8.3C17.1 8.7 17.1 9.3 16.7 9.7Z" />
    </svg>
  )
}
