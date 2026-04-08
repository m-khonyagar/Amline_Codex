import Image from 'next/image'
import { cn } from '@/lib/utils'

// Import SVG images
import rentTrackingCodeImg from '../assets/images/rent-tracking-code.svg'
import realtorDocs from '../assets/images/realtor-docs.svg'
import realtorInquiry from '../assets/images/realtor-inquiry.svg'
import realtorSupportImg from '../assets/images/realtor-support.svg'
import rentTimeImg from '../assets/images/rent-time.svg'

const benefits = [
  {
    id: 1,
    icon: rentTrackingCodeImg,
    title: 'صدور کد رهگیری در لحظه',
    description:
      'بدون تأخیر و نیاز به سامانه‌های دیگر، کد رهگیری رسمی را بعد از امضای دیجیتال دریافت کنید.',
  },
  {
    id: 2,
    icon: realtorDocs,
    title: 'دسترسی به پنل اختصاصی',
    description: 'مدیریت، طبقه‌بندی و آرشیو امن قراردادهای دفتر املاک شما',
  },
  {
    id: 3,
    icon: realtorInquiry,
    title: 'استعلامات آنلاین',
    description: 'استعلام ملک، هویت طرفین و... برای کاهش ریسک معاملات',
  },
  {
    id: 4,
    icon: realtorSupportImg,
    title: 'پشتیبانی تخصصی و رایگان',
    description: 'در تمام مراحل، تیم حقوقی و تیم فنی املاین در کنار شماست.',
  },
  {
    id: 6,
    icon: rentTimeImg,
    title: 'صرفه‌جویی در هزینه و زمان',
    description: 'حذف هزینه‌های چاپ، بایگانی، و زمان برای ثبت قراردادهای کاغذی و...',
  },
]

export const RealtorBenefit = ({ className }: { className?: string }) => {
  return (
    <section className={cn('container', className)}>
      <h2 className="mb-6 text-center font-bold text-gray-800 sm:text-lg md:mb-9 md:text-xl lg:mb-12 lg:text-2xl">
        چرا مشاوران املاک حرفه‌ای «املاین» را انتخاب می‌کنند؟
      </h2>

      <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-3">
        {benefits.map(benefit => (
          <div key={benefit.id} className="flex flex-col items-center gap-4 md:flex-row">
            <div className="relative size-12 shrink-0 sm:size-20">
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
