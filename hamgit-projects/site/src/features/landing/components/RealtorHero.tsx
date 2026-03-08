import Image from 'next/image'
import { cn } from '@/lib/utils'
import { env } from '@/config/env'
import { Button } from '@/components/ui/button'

export const RealtorHero = ({ className }: { className?: string }) => {
  return (
    <section className={cn('relative bg-sky-950', className)}>
      <div className="container">
        <div className="flex flex-col py-6 text-white sm:w-1/2 sm:pl-6 md:py-8 md:pl-10 lg:py-11 lg:pl-14 xl:pl-20">
          <h1 className="mb-5 font-bold sm:max-w-sm md:text-xl lg:text-3xl">
            قراردادهای املاک را سریع، امن و با نظارت حقوقی منعقد کنید!
          </h1>

          <p className="mb-6 text-sm font-medium md:text-base lg:mb-11 lg:text-lg">
            در املاین با استفاده از پنل اختصاصی ویژه مشاوران املاک، آنلاین قرارداد ببندید، برای
            قراردادها کد رهگیری آنی صادر کنید، آنلاین استعلام بگیرید و قراردادهای خود را مدیریت
            کنید!
          </p>

          <Button asChild>
            <a href={`${env.APP_URL}/auth/realtor`}>ورود به پنل مشاور املاک</a>
          </Button>
        </div>
      </div>

      <div className="absolute top-0 left-0 h-full w-1/2 max-sm:hidden">
        <Image
          fill
          priority
          fetchPriority="high"
          alt="اجاره و رهن ملک"
          className="object-cover"
          src="/images/banners/realtor-hero.webp"
        />
      </div>
    </section>
  )
}
