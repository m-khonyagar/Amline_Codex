import { SvgIconProps } from '@/types/common'

export const DocumentEditIcon = ({
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
        d="M17.9972 42.0072H9.99385C7.78379 42.0072 5.99219 40.2156 5.99219 38.0055V9.99385C5.99219 7.78379 7.78379 5.99219 9.99385 5.99219H34.0039C36.2139 5.99219 38.0055 7.78379 38.0055 9.99385V15.9964"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 42.0082L29.2502 41.3599C29.6196 41.3142 29.9632 41.1467 30.2266 40.8837L42.9479 28.1624C44.3569 26.7594 44.3623 24.4799 42.9599 23.0703L42.9479 23.0603V23.0603C41.5449 21.6513 39.2654 21.6459 37.8558 23.0483V23.0603L25.2505 35.6655C24.9941 35.9202 24.8282 36.252 24.7783 36.6099L24 42.0082Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.0013 34.0025V34.0025C14.3437 34.0025 13 32.6588 13 31.0013V31.0013C13 29.3437 14.3437 28 16.0013 28V28C17.6588 28 19.0025 29.3437 19.0025 31.0013V31.0013C19.0025 32.6588 17.6588 34.0025 16.0013 34.0025Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 14.0004H29.0067"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 21.0004H21.0033"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
