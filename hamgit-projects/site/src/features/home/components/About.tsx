import Image from 'next/image'
import { cn } from '@/lib/utils'

// Images
import Image1 from '@/assets/images/home/modern-building-exterior-light.webp'
import Image2 from '@/assets/images/home/modern-building-exterior-angle.webp'
import Image3 from '@/assets/images/home/modern-building-reflection-bw.webp'

export const About = ({ className }: { className?: string }) => (
  <section className={cn('container', className)}>
    <div className="grid h-72 grid-cols-1 gap-4 bg-sky-950 max-md:rounded-3xl max-md:px-5 max-md:pb-8 md:h-[295px] md:grid-cols-2 md:rounded-tr-[55px] lg:h-[345px] lg:rounded-tr-[70px] xl:h-[435px]">
      <div className="relative flex items-center">
        <h2 className="text-2xl font-bold text-white max-sm:flex max-sm:flex-col sm:text-3xl md:hidden">
          <span>درباره</span> <span>املاین</span>
        </h2>

        <div className="absolute -top-8 flex gap-2.5 max-md:left-0 sm:-top-20 sm:gap-5 md:top-8 md:-right-5 lg:gap-8">
          <div className="pt-2.5 sm:pt-5 lg:pt-8">
            <div className="relative aspect-270/345 w-[92px] overflow-hidden rounded-lg sm:w-[130px] md:w-[170px] lg:w-[200px] xl:w-[270px]">
              <Image
                src={Image2}
                alt="modern-building-exterior-angle"
                sizes="(max-width: 640px) 92px, 270px"
                className="object-cover"
                fill
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:gap-5 lg:gap-8">
            <div className="relative aspect-270/265 w-[92px] overflow-hidden rounded-lg sm:w-[130px] md:w-[170px] lg:w-[200px] xl:w-[270px]">
              <Image
                src={Image1}
                alt="modern-building-exterior-light"
                sizes="(max-width: 640px) 92px, 270px"
                className="object-cover"
                fill
              />
            </div>

            <div className="relative aspect-270/140 w-[92px] overflow-hidden rounded-lg sm:w-[130px] md:w-[170px] lg:w-[200px] xl:w-[270px]">
              <Image
                src={Image3}
                alt="modern-building-reflection-bw"
                sizes="(max-width: 640px) 92px, 270px"
                className="object-cover"
                fill
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-end md:justify-center">
        <h3 className="mb-4 text-2xl font-bold text-white max-md:hidden lg:text-3xl">
          درباره املاین
        </h3>

        <p className="text-justify text-sm text-white sm:text-base md:w-11/12 lg:w-5/6 lg:text-lg">
          املاین با هدف ساده‌سازی و هوشمندسازی معاملات ملکی در سراسر کشور ایجاد شده است. ما بستری
          فراهم کرده‌ایم که شما بتوانید قراردادهای رهن، اجاره و خرید و فروش ملک را به‌صورت آنلاین
          تنظیم و امضا کنید؛ قراردادهایی که دارای کد رهگیری رسمی هستند و همان اعتبار قراردادهای
          حضوری را دارند.
        </p>
      </div>
    </div>
  </section>
)
