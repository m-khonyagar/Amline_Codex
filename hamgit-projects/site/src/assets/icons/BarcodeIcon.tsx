import type { SvgIconProps } from '@/types/common'

export const BarcodeIcon = ({
  color = 'currentColor',
  className = 'size-6',
  ...props
}: SvgIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
    className={className}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 15H7.75V33H6V15ZM9.5 15H13V33H9.5V15ZM16.5 15H18.25V33H16.5V15ZM20 15H25.25V33H20V15ZM27 15H28.75V33H27V15ZM32.25 15H34V33H32.25V15ZM35.75 15H37.5V33H35.75V15ZM39.25 15H41V33H39.25V15Z"
      fill={color}
    />
  </svg>
)
