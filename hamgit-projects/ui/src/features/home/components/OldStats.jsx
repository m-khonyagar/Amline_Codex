import logoImg from '@/assets/images/landing/logo-icon.svg'
import { Image } from '@/components/ui/Image'
import { cn } from '@/utils/dom'
import { numberSeparator } from '@/utils/number'

const STATS = {
  contractCount: 60,
  contractValue: 14300000000,
  activeUsers: 300,
}

function OldStats({ className }) {
  return (
    <div
      className={cn('py-10 text-center rounded-3xl', className)}
      style={{ boxShadow: 'inset 0 0 100px #209B9D66' }}
    >
      <Image className="w-28 mx-auto" src={logoImg.src} ratio={78 / 98} />

      <div className="font-bold mt-4">
        املاین؛ بیمه اجاره املاک
        <br />
        با املاین هیچ اجاره ای عقب نمیوفته
      </div>

      <div className="text-sm font-normal mt-4 mb-8">برخی از دستاورد های املاین:</div>

      <div className="font-normal text-2xl fa">
        بیش از {numberSeparator(STATS.contractCount)}
        <span className="text-base text-[#898989] block mt-1">قرارداد آنلاین</span>
      </div>

      <div className="font-normal text-2xl fa mt-4">
        {numberSeparator(STATS.contractValue)} تومان
        <span className="text-base text-[#898989] block mt-1">ارزش قراردادها</span>
      </div>

      <div className="font-normal text-2xl fa mt-4">
        بیش از {numberSeparator(STATS.activeUsers)}
        <span className="text-base text-[#898989] block mt-1">کاربر فعال </span>
      </div>
    </div>
  )
}

export default OldStats
