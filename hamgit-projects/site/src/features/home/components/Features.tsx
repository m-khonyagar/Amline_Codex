import { cn } from '@/lib/utils'
import { BarcodeIcon, ClockIcon, CoinStackIcon } from '@/assets/icons'

const features = [
  {
    id: 1,
    icon: <BarcodeIcon className="size-8 text-sky-950 sm:size-12" />,
    title: 'دریافت کدرهگیری رایگان!',
    description:
      'بعد از اینکه قراردادت رو توی املاین نوشتی،  ما برات کد رهگیری رسمی  رو میگیریم تا خیالت از همه چیز راحت باشه.',
  },
  {
    id: 2,
    icon: <CoinStackIcon className="size-8 text-sky-950 sm:size-12" />,
    title: 'حق کمیسیون شفاف و قانونی',
    description:
      'املاین فقط حداقل کمیسیون قانونی رو دریافت می‌کنه که توسط اتحادیه مشاوران املاک تعیین شده. نه بیشتر، نه کمتر!',
  },
  {
    id: 3,
    icon: <ClockIcon className="size-8 text-sky-950 sm:size-12" />,
    title: '۷ روز هفته، ۲۴ ساعت',
    description:
      'در هر ساعتی از شبانه‌روز حتی نیمه شب یا بامداد می‌تونی قرارداد موردنظرت رو تو کمتر از ده دقیقه بنویسی.',
  },
]

export const Features = ({ className }: { className?: string }) => {
  return (
    <section className={cn('container', className)}>
      <h2 className="mb-6 text-center text-xl font-bold text-stone-900 sm:mb-12 sm:text-2xl md:mb-16 md:text-3xl">
        مزایای بستن قرارداد در املاین
      </h2>

      <div className="mx-auto grid w-full max-w-lg grid-cols-1 gap-4 lg:max-w-5xl lg:grid-cols-3">
        {features.map(feature => (
          <div
            key={feature.id}
            className="rounded-2xl bg-stone-50 px-6 py-4 text-center shadow-sm sm:px-8 sm:py-6"
          >
            <div className="mx-auto mb-2 flex size-8 translate-x-1/5 items-center justify-center rounded-[5px_3px_10px_3px] bg-[#AEDCDC] sm:mb-4 sm:size-12 sm:rounded-[10px_5px_18px_5px]">
              <div className="-translate-x-2/5 -translate-y-1/10">{feature.icon}</div>
            </div>

            <h4 className="mb-2 font-bold text-neutral-600 sm:text-xl">{feature.title}</h4>
            <p className="text-xs text-neutral-500 sm:text-sm sm:leading-6">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
