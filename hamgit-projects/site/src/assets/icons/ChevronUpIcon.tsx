import type { SvgIconProps } from '@/types/common'

export const ChevronUpIcon = ({
  color = 'currentColor',
  className = 'size-6',
  ...props
}: SvgIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke={color}
    className={className}
    {...props}
  >
    <path
      d="M16.5 14.5L11.5 9.5L6.5 14.5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
