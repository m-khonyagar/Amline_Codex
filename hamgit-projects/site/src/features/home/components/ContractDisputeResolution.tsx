import Image from 'next/image'
import { cn } from '@/lib/utils'

import ContractDisputeResolutionImg from '../assets/images/contract-dispute-resolution.svg'

export const ContractDisputeResolution = ({ className }: { className?: string }) => (
  <section className={cn('bg-sky-950', className)}>
    <div className="container">
      <div className="xl:mx-auto xl:w-10/12">
        <div className="flex items-center justify-between gap-12 py-8 md:gap-24 md:py-12">
          <div className="flex flex-col gap-6 md:gap-8">
            <h2 className="text-xl font-bold text-white max-sm:text-center md:text-2xl lg:text-3xl">
              در صورت بروز اختلاف در قرارداد چه ‌کنیم؟
            </h2>
            <p className="text-white lg:text-lg">
              اگر بین طرفین قرارداد اختلافی پیش بیاید، تیم حقوقی املاین با داوری حقوقی حرفه‌ای،‌
              سریع و بی‌طرفانه مشکل را حل می‌کند. این روند بدون درگیری‌های پیچیده دادگاهی انجام
              می‌شود تا با آرامش خاطر معامله کنید.
            </p>
          </div>

          <div className="relative size-44 shrink-0 max-sm:hidden md:size-56 lg:size-64">
            <Image
              fill
              src={ContractDisputeResolutionImg}
              className="object-contain"
              alt="در صورت بروز اختلاف در قرارداد چه ‌کنیم؟"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
)
