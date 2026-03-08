export function AdsIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 20"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...props}
    >
      <path
        d="M19.8281 12.3355L15.9894 0.972092L14.9015 1.86514C11.2889 4.83071 7.16872 7.11685 2.74066 8.61269C2.29099 8.76459 2.04961 9.25226 2.20151 9.70193L3.8458 14.5694C8.8122 12.8917 14.0416 12.1282 19.2803 12.3159L19.8281 12.3355Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M3.73438 14.1484L5.37387 19.0017L8.20872 18.0441L6.56922 13.1908"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M21.2078 6.7799C21.3861 5.55358 20.8586 4.31475 19.8379 3.5625"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
