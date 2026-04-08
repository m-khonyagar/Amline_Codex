import Image from 'next/image'
import { env } from '@/config/env'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import rentContractReadyImg from '../assets/images/rent-contract-ready.webp'

export const RentReadyContract = ({ className }: { className?: string }) => {
  return (
    <section className={cn('container', className)}>
      <div className="relative isolate mx-auto h-[150px] max-w-5xl overflow-hidden rounded-2xl bg-[#5DB8BA] pl-[6%] sm:h-[200px] md:h-[270px] lg:h-[350px]">
        <div className="mr-auto flex w-40 flex-col gap-2 sm:gap-4 md:w-3xs md:gap-6 lg:w-xs">
          <div className="flex flex-col items-center rounded-b-2xl bg-neutral-50 py-4 shadow-[0px_5px_12px_0px_rgba(0,0,0,0.05)] md:rounded-b-[64px] md:py-8 lg:py-14">
            <p className="text-primary text-sm leading-5 font-bold sm:text-base md:text-2xl md:leading-12 lg:text-3xl">
              آمــــاده‌ای قراردادت <br />
              رو تنظیـــــم کنـــــی؟
            </p>
          </div>

          <Button asChild variant="outline" size="lg" className="max-sm:h-7 max-sm:text-xs">
            <a href={`${env.APP_URL}/contracts/new`}>شروع قرارداد</a>
          </Button>
        </div>

        <div className="absolute top-5 right-0 bottom-0 left-0 -z-1 sm:left-[50%]">
          <Image
            fill
            alt="اجاره و رهن ملک"
            className="object-contain object-right sm:object-cover"
            src={rentContractReadyImg}
          />
        </div>
      </div>
    </section>
  )
}
