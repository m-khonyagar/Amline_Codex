import Link from 'next/link'
import clsx from 'clsx'
import { Button } from '@/components/ui/button'
import {
  CertificateCheckmarkIcon,
  DocumentEditIcon,
  ProfileIcon,
  ChevronLeftIcon,
} from '@/assets/icons'

type Props = {
  className?: string
}

export function RealtorStats({ className }: Props) {
  return (
    <section className={clsx('w-full bg-sky-950 text-white', className)}>
      <div className="container py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 gap-9 lg:grid-cols-12 lg:items-center lg:gap-4">
          <div className="lg:col-span-5">
            <h2 className="text-lg leading-relaxed font-bold max-md:text-center sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
              آنچه تا امروز با شما ساخته‌ایم
            </h2>
            <p className="mt-6 text-xs leading-6 font-medium max-md:text-center sm:text-sm md:mt-2 md:text-base">
              سه سال رشد مداوم در معامله املاک کشور؛
              <br /> با گزارش‌های واقعی و مجوزهای معتبر، مسیر اعتماد را ادامه می‌دهیم.
            </p>
            <Button className="mt-5 max-lg:hidden" asChild>
              <Link href="/licenses">
                مشاهده مجوزها
                <ChevronLeftIcon className="size-5" />
              </Link>
            </Button>
          </div>

          <div className="lg:col-span-7">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-10 lg:justify-end xl:gap-16">
              <StatItem
                icon={<DocumentEditIcon className="size-8 sm:size-10 xl:size-12" />}
                value="400+"
                description={
                  <>
                    قرارداد بسته‌شده موفق <br /> در املاین
                  </>
                }
              />
              <StatItem
                icon={<ProfileIcon className="size-8 sm:size-10 xl:size-12" />}
                value="210+"
                description={
                  <>
                    مشاور املاک فعال <br /> در املاین
                  </>
                }
              />
              <StatItem
                icon={<CertificateCheckmarkIcon className="size-8 sm:size-10 xl:size-12" />}
                value="%84"
                description={
                  <>
                    رضایت کاربران پس از <br /> انعقاد قرارداد
                  </>
                }
              />
            </div>
          </div>

          <div className="flex justify-end lg:hidden">
            <Button size="sm" asChild>
              <Link href="/licenses">
                مشاهده مجوزها
                <ChevronLeftIcon className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

type StatItemProps = {
  icon: React.ReactNode
  value: string
  description: React.ReactNode
}

function StatItem({ icon, value, description }: StatItemProps) {
  return (
    <div className="max-w-48 flex-1">
      <div className="flex items-center gap-2 max-sm:justify-center sm:gap-4">
        <div className="fa text-3xl leading-relaxed font-bold sm:text-4xl xl:text-5xl">{value}</div>
        <div className="shrink-0">{icon}</div>
      </div>
      <div className="text-xs leading-6 text-slate-300 max-sm:text-center sm:text-sm">
        {description}
      </div>
    </div>
  )
}
