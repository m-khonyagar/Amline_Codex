import Image from 'next/image'
import { env } from '@/config/env'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import realtorContractImg from '../assets/images/realtor-contract.webp'

export const RealtorContractCTA = ({ className }: { className?: string }) => (
  <section className={cn('container', className)}>
    <div className="relative isolate mx-auto h-[150px] max-w-5xl overflow-hidden rounded-2xl bg-sky-950 pl-[6%] sm:h-[200px] md:h-[270px] lg:h-[350px]">
      <div className="mr-auto flex w-40 flex-col gap-2 sm:gap-4 md:w-3xs md:gap-6 lg:w-xs">
        <div className="flex justify-center rounded-b-3xl bg-neutral-50 py-6 shadow-[0px_5px_12px_0px_rgba(0,0,0,0.05)] sm:py-8 lg:rounded-b-[64px] lg:py-14">
          <p className="text-primary text-center text-xs leading-normal font-bold sm:text-sm md:text-base lg:text-3xl">
            اولین قراردادت رو رایگان <br />و بدون کمیسیون ببند!
          </p>
        </div>

        <Button asChild className="max-sm:h-7 max-sm:text-xs">
          <a href={`${env.APP_URL}/contracts/new`}>شروع قرارداد</a>
        </Button>
      </div>

      <div className="absolute inset-0 -z-1 sm:left-[50%]">
        <Image
          fill
          alt="اجاره و رهن ملک"
          className="object-contain object-right sm:object-cover"
          src={realtorContractImg}
        />
      </div>
    </div>
  </section>
)
