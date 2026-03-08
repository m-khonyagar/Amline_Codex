import Image, { type StaticImageData } from 'next/image'
import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { MapPinIcon } from '@/assets/icons'

import sampleUserSvg1 from '../assets/images/sample-user-1.svg'
import sampleUserSvg2 from '../assets/images/sample-user-2.svg'
import sampleUserSvg3 from '../assets/images/sample-user-3.svg'
import sampleUserSvg4 from '../assets/images/sample-user-4.svg'
import sampleUserSvg5 from '../assets/images/sample-user-5.svg'
import sampleUserSvg6 from '../assets/images/sample-user-6.svg'

const FEEDBACKS = [
  {
    key: '1',
    img: sampleUserSvg1,
    name: 'الهام خدادادی',
    city: 'کرج',
    office: 'املاک آراد',
    text: 'خیلی خوبه که تیم حقوقی خودشون متن رو بررسی می‌کنه. حس امنیت بیشتری داریم.',
  },
  {
    key: '2',
    img: sampleUserSvg2,
    name: 'محسن کریمی',
    city: 'تهران',
    office: 'املاک اعتماد',
    text: 'پنلش تمیز و کاربردیه. همه قراردادها یه‌جا ذخیره می‌شن و هر وقت بخوای می‌تونی ببینی.',
  },
  {
    key: '3',
    img: sampleUserSvg3,
    name: 'نرگس سادات موسوی',
    city: 'قم',
    office: 'املاک الماس',
    text: 'صدور کد رهگیری لحظه‌ای واقعاً کمک بزرگیه. مشتری‌هام اعتماد بیشتری پیدا کردن.',
  },
  {
    key: '4',
    img: sampleUserSvg4,
    name: 'کیوان سلطانی',
    city: 'قم',
    office: 'املاک باران',
    text: 'همه چیز مرحله‌به‌مرحله انجام می‌شه، حتی همکارای قدیمی‌تر هم راحت یاد گرفتن باهاش کار کنن.',
  },
  {
    key: '5',
    img: sampleUserSvg5,
    name: 'امیررضا مرادی ',
    city: 'تهران',
    office: 'املاک پارسیان',
    text: 'کار با املاین خیلی راحت‌تر از روش‌های قبلیه. قرارداد رو سریع می‌بندیم و دیگه نیازی به کاغذبازی نیست.',
  },
  {
    key: '6',
    img: sampleUserSvg6,
    name: 'سارا رفیعی',
    city: 'اصفهان',
    office: 'املاک آفتاب',
    text: 'سیستم ساده و قابل فهمه، قراردادها هم با دقت تنظیم می‌شن. سرعت کارمون خیلی بالاتر رفته.',
  },
]

export const RealtorFeedback = ({ className }: { className?: string }) => {
  return (
    <section className={cn('container', className)}>
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-center font-bold text-gray-800 sm:text-lg md:mb-9 md:text-xl lg:mb-12 lg:text-2xl">
          املاین از نگاه مشاوران املاک
        </h2>

        <Carousel
          opts={{
            align: 'start',
            direction: 'rtl',
            breakpoints: { '(min-width: 768px)': { active: false } },
          }}
        >
          <CarouselContent className="ml-0">
            {FEEDBACKS.sort(() => Math.random() - 0.5).map(feedback => (
              <CarouselItem
                key={feedback.key}
                className="basis-full pl-0 md:basis-1/2 lg:basis-1/3"
              >
                <FeedbackCard
                  img={feedback.img}
                  name={feedback.name}
                  city={feedback.city}
                  office={feedback.office}
                  text={feedback.text}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselNext className="md:hidden" />
          <CarouselPrevious className="md:hidden" />
        </Carousel>
      </div>
    </section>
  )
}

type CardProps = {
  img: StaticImageData
  name: string
  city: string
  office: string
  text: string
}

function FeedbackCard({ img, name, city, office, text }: CardProps) {
  return (
    <div className="p-3">
      <div className="rounded-4xl p-6 shadow-[0px_0px_12px_0px_rgba(0,0,0,0.1)] md:px-7">
        <div className="flex items-center gap-4">
          <Image
            className="size-18 shrink-0 overflow-hidden rounded-full sm:size-20"
            src={img}
            alt={name}
          />

          <div className="flex flex-col gap-1">
            <span className="text-sm leading-6 font-bold sm:text-base">{name}</span>
            <span className="flex items-center gap-1 text-xs text-gray-700 sm:text-sm">
              <MapPinIcon className="size-5 text-zinc-600" />
              <span>
                {city} - {office}
              </span>
            </span>
          </div>
        </div>

        <p className="mt-2.5 text-sm text-gray-800 sm:mt-4">{text}</p>
      </div>
    </div>
  )
}
