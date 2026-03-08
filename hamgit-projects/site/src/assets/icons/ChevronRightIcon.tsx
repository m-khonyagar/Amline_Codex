import type { SvgIconProps } from '@/types/common'

export const ChevronRightIcon = ({
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
    <path d="M9 17L14 12L9 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
