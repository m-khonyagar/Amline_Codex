import { SvgIconProps } from '@/types/common'

export const CopyIcon = ({
  color = 'currentColor',
  className = 'size-6',
  ...props
}: SvgIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      <rect
        x="7"
        y="6.99219"
        width="14.0058"
        height="14.0058"
        rx="2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.99776 16.998H4.99693C3.8919 16.998 2.99609 16.1022 2.99609 14.9972V4.99302C2.99609 3.88799 3.8919 2.99219 4.99693 2.99219H15.0011C16.1061 2.99219 17.0019 3.88799 17.0019 4.99302V6.99385"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
