import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { UserChatBoldIcon } from '@/components/icons'

const reviews = [
  {
    id: 1,
    name: 'محمد جواد دهقان اشکذری',
    position: '(مدیرعامل آسارا سفر)',
    comment:
      'بخاطر شرایط کاری که دارم عموما در سفر هستم و به همین دلیل خیلی وقتا نمیتونم انعقاد قرارداد رو خودم انجام بدم. اما با املاین میتونم بدون اینکه حضور داشته باشم آنلاین قرارداد بنویسم. دمتون گرم واقعا...',
  },
  {
    id: 2,
    name: 'محمد مشعلچی ',
    position: '(مدیرعامل ملی پلاست)',
    comment:
      'املاین فرایندی رو ایجاد کرده که دیگه نیاز نباشه کسب و کار رو رها کنیم و به صورت سنتی قرارداد بنویسیم؛ هم فرایند حسابرسی رو برای تیم حسابداری شرکت راحت کرده و هم اشخاص حقوقی راحت تر اعتماد می کنن.',
  },
  {
    id: 3,
    name: 'امیرمحمد ریاحی‌پور ',
    position: '(هم‌بنیان‌گذار استارتاپ ماشینت)',
    comment:
      'همین که افراد میتوانند با کمترین هزینه و کمترین زمان نسبت به رهن و اجاره ملکشون اقدام کنند و در کنار بیمه اجاره‌، پیچیدگی کمتری رو برای انعقاد قرارداد داشته باشند جای تقدیر داره. ',
  },
  {
    id: 4,
    name: 'مسعود توکلی زاده',
    position: '(رئیس هیات مدیره شهر سلام)',
    comment:
      'فرایند تضمین قرارداد اجاره، موضوعی بود که سالها در انتظارش بودیم که در ایران هم اجرا بشه؛ این اتفاق بزرگ که املاین اجرا کرد.',
  },
  {
    id: 5,
    name: 'محسن خنیاگر',
    position: '(بیزینس منیجر شرکت سلام تامین)',
    comment:
      'به‌عنوان مدیر مارکتینگ، نبود درگاه مالی امن در بازار سنتی، به‌ویژه در املاک، دغدغه‌ام بود. حالا که می‌توان با خیالی راحت به یک شرکت برای معاملات مالی اعتماد کرد، واقعاً خوشحال‌کننده است. خداقوت بهتون',
  },
]

function UserReviews({ className }) {
  const [emblaRef] = useEmblaCarousel({ direction: 'rtl', loop: true }, [Autoplay()])

  return (
    <div className={className}>
      <h4 className="text-lg font-medium text-center">املاین از نگاه کاربران</h4>

      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex items-stretch">
          {reviews.map((review) => (
            <div key={review.id} className="min-w-0 flex-[0_0_85%] p-3.5">
              <div
                className="h-full bg-white rounded-2xl p-4 cursor-grab select-none"
                style={{ boxShadow: '0px 8px 4.3px 0px #21212114' }}
              >
                <div className="flex items-center gap-2">
                  <UserChatBoldIcon size={28} />

                  <div className="flex flex-col">
                    <p className="leading-[20px]">{review.name}</p>
                    <span className="text-xs text-zinc-500 leading-[20px] -mt-1">
                      {review.position}
                    </span>
                  </div>
                </div>
                <p className="text-sm mt-3.5 text-justify leading-6">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserReviews
