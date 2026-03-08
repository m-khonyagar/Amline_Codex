import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, ChevronLeftIcon } from '@/assets/icons'

import HowCanTrustImg from '../assets/images/how-can-trust.svg'

export const HowCanTrust = ({ className }: { className?: string }) => {
  return (
    <section className={cn('bg-sky-950', className)}>
      <div className="container">
        <div className="xl:mx-auto xl:w-10/12">
          <div className="flex items-center justify-between gap-12 py-8 md:gap-24 md:py-12">
            <div className="flex flex-col gap-6 md:gap-8">
              <h2 className="text-xl font-bold text-white max-sm:text-center md:text-2xl lg:text-3xl">
                چطور به املاین اعتماد کنم؟
              </h2>
              <p className="text-white lg:text-lg">
                پلتفرم املاین با رعایت کامل الزامات قانونی و اخذ مجوزهای لازم، فعالیت خود را به‌صورت
                رسمی و تحت نظارت مراجع ذی‌صلاح انجام می‌دهد.
              </p>
              <Button className="w-fit gap-2.5" asChild>
                <Link href="/licenses">
                  مشاهده مجوزها
                  <ArrowLeftIcon className="size-5 max-sm:hidden" />
                  <ChevronLeftIcon className="size-5 sm:hidden" />
                </Link>
              </Button>
            </div>

            <div className="relative size-44 shrink-0 max-sm:hidden md:size-56 lg:size-64">
              <Image
                fill
                src={HowCanTrustImg}
                className="object-contain"
                alt="چطور به املاین اعتماد کنم؟"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
