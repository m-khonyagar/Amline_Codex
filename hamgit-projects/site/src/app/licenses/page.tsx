import type { Metadata } from 'next'
import Image from 'next/image'
import { Suspense } from 'react'
import { BackToAppButton } from '../../components/BackToAppButton'

export const metadata: Metadata = {
  title: 'مجوزها',
  alternates: { canonical: '/licenses' },
}

const licenses = [
  {
    src: '/images/licenses/real-estate-transaction.webp',
    title: 'پروانه کسب معاملات املاک',
    aspect: 'aspect-[40/29]',
    fetchPriority: 'high',
  },
  {
    src: '/images/licenses/virtual-business-union.webp',
    title: 'پروانه کسب اتحادیه کسب و کار مجازی',
    aspect: 'aspect-[40/30]',
  },
  {
    src: '/images/licenses/guild-system.webp',
    title: 'مجوز نظام صنفی',
    aspect: 'aspect-[40/29]',
  },
  {
    src: '/images/licenses/property-management-card.webp',
    title: 'کارت مباشرت املاک',
    aspect: 'aspect-[40/29]',
  },
  {
    src: '/images/licenses/specialized-real-estate-license.webp',
    title: 'پروانه تخصصی مشاورین املاک',
    aspect: 'aspect-[40/30]',
  },
  {
    src: '/images/licenses/establishment-the-technology-unit.webp',
    title: 'مجوز استقرار واحد فناور',
    aspect: 'aspect-[8/11]',
  },
]
export default function LicensesPage() {
  return (
    <section>
      <Suspense fallback={null}>
        <BackToAppButton />
      </Suspense>

      <div className="relative h-44 w-full bg-black/50 md:h-72">
        <Image
          fill
          priority
          fetchPriority="high"
          alt="بنر مجوزها"
          src="/images/banners/hero-licenses.webp"
          className="-z-10 object-cover"
        />
      </div>

      <div className="container py-6 sm:py-12 md:py-20">
        <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8 md:space-y-12">
          <div>
            <h1 className="mb-4 text-center font-bold text-stone-900 sm:text-xl md:text-3xl">
              مجوزهای املاین
            </h1>

            <p className="text-sm text-stone-900 max-sm:text-justify sm:text-center sm:text-base md:text-lg">
              پلتفرم املاین با رعایت کامل الزامات قانونی و اخذ مجوزهای لازم، فعالیت خود را به‌صورت
              رسمی و تحت نظارت مراجع ذی‌صلاح انجام می‌دهد. ما متعهد هستیم که تمام خدمات ارائه‌شده در
              املاین در چهارچوب قوانین و مقررات کشور بوده و با رویکردی شفاف، مطمئن و قانونی در
              اختیار کاربران قرار گیرد. اطمینان خاطر شما، مسئولیت ماست.
            </p>
          </div>

          {licenses.map(lic => (
            <div
              key={lic.src}
              className="flex flex-col items-center gap-1.5 rounded-lg bg-neutral-100 p-2 sm:gap-4 sm:rounded-3xl sm:p-5"
            >
              <div className={`relative ${lic.aspect} size-full`}>
                <Image
                  fill
                  {...(lic.fetchPriority ? { fetchPriority: lic.fetchPriority as 'high' } : {})}
                  src={lic.src}
                  sizes="(max-width: 1280px) 100vw, 1024px"
                  className="object-cover"
                  alt={lic.title}
                />
              </div>

              <h3 className="text-xs text-zinc-700 sm:text-base sm:font-medium">{lic.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

