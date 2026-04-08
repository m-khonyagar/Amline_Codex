'use client'

import Image from 'next/image'
import { env } from '@/config/env'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { CopyIcon } from '@/assets/icons'

import rentDiscountImg from '../assets/images/rent-discount.webp'

export const RentDiscount = ({ className }: { className?: string }) => {
  return (
    <section className={cn('container', className)}>
      <div
        className="relative isolate mx-auto max-w-5xl overflow-hidden rounded-2xl pr-4 md:pr-[9%]"
        style={{
          background:
            'linear-gradient(0deg, #FDC800 0%, #FCC500 24.21%, #FFCF00 71.58%, #FFCF01 100%)',
        }}
      >
        <div className="flex w-48 flex-col gap-2 pb-3.5 sm:w-3xs sm:gap-4 sm:pb-6 md:w-xs md:gap-6 md:pb-10 lg:w-sm">
          <div className="flex flex-col items-center rounded-b-2xl bg-neutral-50 py-2.5 shadow-[0px_5px_12px_0px_rgba(0,0,0,0.05)] sm:py-8 md:rounded-b-[64px]">
            <h3 className="text-primary mb-4 text-center text-sm leading-5 font-bold sm:text-base md:text-xl md:leading-10 lg:text-2xl">
              امروز با ۲۹۰ هزارتومان و <br />
              <span className="text-[#D82E31]">کد رهگیری رایگان</span> قرارداد ببند!
            </h3>

            <div className="flex w-32 items-center justify-between rounded bg-[#E8F5F5] px-1.5 py-1 sm:w-40 md:w-52 md:rounded-xl md:px-4 md:py-2.5 lg:w-60">
              <button
                onClick={() => {
                  toast.info('کد تخفیف کپی شد.')
                  navigator.clipboard.writeText('ErbxZe2')
                }}
                className="text-primary flex cursor-pointer items-center gap-0.5 text-[10px] font-medium sm:gap-1 sm:text-xs md:text-sm lg:text-base"
              >
                <CopyIcon className="size-2.5 sm:size-4 md:size-6" /> کپی کردن
              </button>
              <div className="text-[10px] font-medium text-zinc-600 sm:text-xs md:text-sm lg:text-base">
                ErbxZe2
              </div>
            </div>
          </div>

          <Button asChild className="max-sm:h-6 max-sm:text-xs">
            <a href={`${env.APP_URL}/contracts/new`}>شروع قرارداد</a>
          </Button>
        </div>

        <div className="absolute top-0 right-[45%] bottom-0 left-0 -z-1">
          <Image fill alt="اجاره و رهن ملک" className="object-cover" src={rentDiscountImg} />
        </div>
      </div>
    </section>
  )
}
