import Image from 'next/image'
import { cn } from '@/lib/utils'

// Import SVG images
import rentSignImg from '../assets/images/rent-sign.svg'
import rentTrackingCodeImg from '../assets/images/rent-tracking-code.svg'
import rentPdfImg from '../assets/images/rent-pdf.svg'
import rentSupportImg from '../assets/images/rent-support.svg'
import rentSecureImg from '../assets/images/rent-secure.svg'
import rentTimeImg from '../assets/images/rent-time.svg'

const benefits = [
  {
    id: 1,
    icon: rentSignImg,
    title: 'امضای معتبر',
    description: 'امضای دیجیتال با کد یکبار مصرف',
  },
  {
    id: 2,
    icon: rentTrackingCodeImg,
    title: 'صدور کد رهگیری',
    description: 'کد رهگیری صادر شده از وزارت راه و شهرسازی',
  },
  {
    id: 3,
    icon: rentPdfImg,
    title: 'فایل PDF رسمی',
    description: 'ایجاد فایل قانونی و قابل ارائه در مراجع رسمی',
  },
  {
    id: 4,
    icon: rentSupportImg,
    title: 'پشتیبانی حقوقی',
    description: 'پشتیبانی حقوقی در تمام مراحل',
  },
  {
    id: 5,
    icon: rentSecureImg,
    title: 'امنیت اطلاعات',
    description: 'امنیت اطلاعات با رمزگذاری پیشرفته',
  },
  {
    id: 6,
    icon: rentTimeImg,
    title: 'صرفه‌جویی در زمان و هزینه',
    description: 'بدون مراجعه حضوری و هزینه‌های اضافه',
  },
]

export const RentBenefit = ({ className }: { className?: string }) => {
  return (
    <section className={cn('container', className)}>
      <h2 className="mb-6 text-center font-bold text-gray-800 sm:text-lg md:mb-9 md:text-xl lg:mb-12 lg:text-2xl">
        چرا املاین؟
      </h2>

      <p className="mb-10 text-center text-sm font-medium text-gray-800 sm:mb-12 sm:text-base md:mb-14 md:text-lg">
        هدف ما ساده است: قرارداد امن، سریع و قانونی برای همه. در دنیای پرمشغله امروز، نیازی نیست
        برای هر قرارداد ساعت‌ها وقت و رفت‌ وآمد صرف کنی! قرارداد آنلاین یعنی سرعت، دقت و اطمینان
        حقوقی بدون نیاز به حضور فیزیکی، از طرفی نسخه قراردادت همیشه همراهته و جاشم امنه!
      </p>

      <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-3">
        {benefits.map(benefit => (
          <div key={benefit.id} className="flex flex-col items-center gap-4 md:flex-row">
            <div className="relative size-12 sm:size-20">
              <Image src={benefit.icon} alt={benefit.title} fill className="object-contain" />
            </div>

            <div className="flex flex-col gap-2 max-md:items-center">
              <h3 className="text-sm font-medium text-gray-800 sm:text-base md:text-lg">
                {benefit.title}
              </h3>
              <p className="text-xs text-gray-700 max-md:text-center sm:text-sm">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
