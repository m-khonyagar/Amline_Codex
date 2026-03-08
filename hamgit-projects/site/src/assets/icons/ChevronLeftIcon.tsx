import type { SvgIconProps } from '@/types/common'

export const ChevronLeftIcon = ({
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
    <path d="M14 7L9 12L14 17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
