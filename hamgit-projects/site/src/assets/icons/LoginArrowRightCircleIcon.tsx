import type { SvgIconProps } from '@/types/common'

export const LoginArrowRightCircleIcon = ({
  color = 'currentColor',
  className = 'size-6',
  ...props
}: SvgIconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M15.0042 11.9983H5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15.0005L15.0013 11.9993L12 8.99805"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.94922 16.0017C4.37774 16.8773 4.9475 17.6763 5.63565 18.3667C8.2107 20.9418 12.0834 21.7121 15.4479 20.3185C18.8123 18.9249 21.006 15.6418 21.006 12.0001C21.006 8.35843 18.8123 5.07533 15.4479 3.68172C12.0834 2.28812 8.2107 3.05844 5.63565 5.63351C4.94751 6.32389 4.37775 7.12287 3.94922 7.99839"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
