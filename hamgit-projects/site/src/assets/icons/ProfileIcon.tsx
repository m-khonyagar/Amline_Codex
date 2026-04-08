import type { SvgIconProps } from '@/types/common'

export const ProfileIcon = ({
  color = 'currentColor',
  className = 'size-6',
  ...props
}: SvgIconProps) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 48 48"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19.8284 20.3591C21.3905 21.9212 21.3905 24.4538 19.8284 26.0159C18.2663 27.578 15.7337 27.578 14.1716 26.0159C12.6095 24.4538 12.6095 21.9212 14.1716 20.3591C15.7337 18.797 18.2663 18.797 19.8284 20.3591"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 22H38"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 29H30"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 36.0835C23.66 35.2295 23.134 34.4615 22.458 33.8355V33.8355C21.316 32.7775 19.816 32.1875 18.258 32.1875H15.742C14.184 32.1875 12.684 32.7755 11.542 33.8355V33.8355C10.866 34.4595 10.34 35.2275 10 36.0835"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26 14H22C20.896 14 20 13.104 20 12V6C20 4.896 20.896 4 22 4H26C27.104 4 28 4.896 28 6V12C28 13.104 27.104 14 26 14Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 10H8.082C5.828 10 4 11.828 4 14.082V38C4 40.21 5.79 42 8 42H40C42.21 42 44 40.21 44 38V14C44 11.79 42.21 10 40 10H28"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
