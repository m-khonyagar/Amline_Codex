import { cn } from '@/lib/utils'
import { CalendarIcon, CoinStackIcon, ContractEditIcon, User2Icon } from '@/assets/icons'

const stats = [
  {
    key: 'users',
    icon: <User2Icon className="size-8 text-orange-800 sm:size-12" />,
    value: '۲۰,۰۰۰',
    label: 'کاربر',
  },
  {
    key: 'online-contract',
    icon: <ContractEditIcon className="size-8 text-orange-800 sm:size-12" />,
    value: '۱۲۵',
    label: 'قرارداد آنلاین',
  },
  {
    key: 'activity-history',
    icon: <CalendarIcon className="size-8 text-orange-800 sm:size-12" />,
    value: '۳ سال',
    label: 'سابقه فعالیت',
  },
  {
    key: 'value-contract',
    icon: <CoinStackIcon className="size-8 text-orange-800 sm:size-12" />,
    value: '۱۰ میلیارد',
    label: 'ارزش قراردادهای املاین',
  },
]

export const Achievements = ({ className }: { className?: string }) => (
  <section className={cn('bg-orange-800/5 py-6 sm:py-16', className)}>
    <div className="container flex items-center gap-6 max-lg:flex-col sm:gap-12 lg:gap-4">
      <div className="flex-1 max-lg:text-center">
        <h2 className="font-medium text-black sm:text-3xl sm:leading-11 2xl:text-4xl">
          با املاین، امن و آنلاین قرارداد بنویس
          <br />
          <span className="text-orange-800">دستاورد های املاین</span>
        </h2>
        <p className="mt-0.5 text-xs font-light text-black sm:mt-2 sm:text-base 2xl:text-lg">
          ما با تلاش مستمر و تعهد واقعی به مسیـرمون، به اینجا رسیدیم.
        </p>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-2 sm:gap-6">
        {stats.map(item => (
          <div key={item.key} className="flex items-start gap-2 sm:items-center sm:gap-4">
            <div>{item.icon}</div>
            <div className="sm:-space-y-1.5">
              <div className="text-xl font-medium text-black sm:text-3xl">{item.value}</div>
              <div className="text-xs font-medium text-neutral-500 sm:text-base">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)
