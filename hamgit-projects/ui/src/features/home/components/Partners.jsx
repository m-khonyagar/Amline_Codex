import { Image } from '@/components/ui/Image'

import tankLogo from '@/assets/images/partners/tank.png'
// import sadrunLogo from '@/assets/images/partners/sadrun.png'
// import amadastLogo from '@/assets/images/partners/amadast.png'
import basalamLogo from '@/assets/images/partners/basalam.png'
import journeyLogo from '@/assets/images/partners/journey.png'
import melliPelastLogo from '@/assets/images/partners/melli-pelast.png'
import catrinPelastLogo from '@/assets/images/partners/catrin-pelast.png'

function Partners({ className }) {
  return (
    <div className={className}>
      <h5 className="font-medium text-lg text-center">همکاران املاین:</h5>

      <div className="relative">
        <svg
          width="360"
          height="171"
          viewBox="0 0 360 171"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-full"
        >
          <path
            opacity="0.09"
            d="M0 11.8021C176.553 66.4515 247.404 -32.3545 360 11.8021V164.394C176.553 99.6768 212.553 193.235 0 164.394V11.8021Z"
            fill="#B65430"
          />
        </svg>

        <div className="absolute z-10 w-full top-1/2 -translate-y-1/2 px-4">
          <div className="flex gap-7 justify-between items-center">
            <Image
              className="flex-grow max-w-20"
              src={melliPelastLogo.src}
              ratio={30 / 40}
              alt="ملی پلاست"
            />

            <Image
              className="flex-grow max-w-20"
              src={journeyLogo.src}
              ratio={37 / 44}
              alt="جرنی"
            />

            <Image
              className="flex-grow max-w-20"
              src={basalamLogo.src}
              ratio={65 / 40}
              alt="باسلام"
            />

            <Image className="flex-grow max-w-20" src={tankLogo.src} ratio={1} alt="تانک" />

            <Image
              className="flex-grow max-w-20"
              src={catrinPelastLogo.src}
              ratio={91 / 128}
              alt="کاترین پلاست"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Partners
