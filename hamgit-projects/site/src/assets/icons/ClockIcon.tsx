import type { SvgIconProps } from '@/types/common'

export const ClockIcon = ({
  color = 'currentColor',
  className = 'size-6',
  ...props
}: SvgIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
    stroke={color}
    className={className}
    {...props}
  >
    <path
      d="M27.8963 30.6875L23 25.7912V16"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
    <path
      d="M23.5 38.1875C27.3954 38.1875 31.1312 36.6401 33.8856 33.8856C36.6401 31.1312 38.1875 27.3954 38.1875 23.5C38.1875 19.6046 36.6401 15.8688 33.8856 13.1144C31.1312 10.3599 27.3954 8.8125 23.5 8.8125C19.6046 8.8125 15.8688 10.3599 13.1144 13.1144C10.3599 15.8688 8.8125 19.6046 8.8125 23.5C8.8125 27.3954 10.3599 31.1312 13.1144 33.8856C15.8688 36.6401 19.6046 38.1875 23.5 38.1875Z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
