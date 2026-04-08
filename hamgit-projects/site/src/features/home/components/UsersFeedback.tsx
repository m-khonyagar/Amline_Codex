import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPagination,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { PersonChatFilled } from '@/assets/icons'

type Feedback = {
  id: number
  name: string
  position: string
  comment: string
}

type FeedbackCardProps = {
  feedback: Feedback
  className?: string
}

const feedbacks: Feedback[] = [
  {
    id: 1,
    name: 'محمدجواد دهقان اشکذری',
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

function UsersFeedback({ className }: { className?: string }) {
  return (
    <section className={cn('container px-2', className)}>
      <Carousel
        opts={{
          align: 'start',
          direction: 'rtl',
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {feedbacks.map(feedback => (
            <CarouselItem key={feedback.id} className="basis-full pl-0 sm:basis-1/2 lg:basis-1/3">
              <FeedbackCard feedback={feedback} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPagination />
      </Carousel>
    </section>
  )
}

function FeedbackCard({ feedback, className }: FeedbackCardProps) {
  return (
    <div className={cn('h-full p-2 pt-8', className)}>
      <div className="relative h-full rounded-2xl bg-white p-6 pt-12 shadow-md shadow-black/25 select-none">
        <div className="absolute top-0 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-md shadow-black/25">
          <PersonChatFilled className="size-10" />
        </div>

        <div className="flex flex-col items-center">
          <p className="mb-1.5 text-xl text-black">{feedback.name}</p>
          <span className="mb-3.5 text-zinc-500">{feedback.position}</span>
          <p className="line-clamp-4 text-justify leading-7">{feedback.comment}</p>
        </div>
      </div>
    </div>
  )
}

export { UsersFeedback }
