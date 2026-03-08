import React from 'react'
import { ClockIcon } from '@/components/icons'
import { BarcodeIcon } from '@/components/icons/BarcodeIcon'
import { CoinStackIcon } from '@/components/icons/CoinStackIcon'
import { cn } from '@/utils/dom'

const features = [
  {
    id: 1,
    icon: <BarcodeIcon className="size-8 text-sky-950" />,
    title: 'دریافت کدرهگیری رایگان!',
    description:
      'بعد از اینکه قراردادت رو توی املاین نوشتی،  ما برات کد رهگیری رسمی  رو میگیریم تا خیالت از همه چیز راحت باشه.',
  },
  {
    id: 2,
    icon: <CoinStackIcon className="size-8 text-sky-950" />,
    title: 'حق کمیسیون شفاف و قانونی',
    description:
      'املاین فقط حداقل کمیسیون قانونی رو دریافت می‌کنه که توسط اتحادیه مشاوران املاک تعیین شده. نه بیشتر، نه کمتر!',
  },
  {
    id: 3,
    icon: <ClockIcon className="size-8 text-sky-950" />,
    title: '۷ روز هفته، ۲۴ ساعت',
    description:
      'در هر ساعتی از شبانه‌روز حتی نیمه شب یا بامداد می‌تونی قرارداد موردنظرت رو تو کمتر از ده دقیقه بنویسی.',
  },
]

export function Features({ className }) {
  return (
    <section className={cn('container', className)}>
      <h2 className="mb-6 text-center text-xl font-bold text-stone-900">
        مزایای بستن قرارداد در املاین
      </h2>

      <div className="mx-auto grid w-full max-w-lg grid-cols-1 gap-4">
        {features.map((feature) => (
          <div key={feature.id} className="rounded-2xl bg-stone-50 px-6 py-4 text-center shadow-sm">
            <div className="mx-auto mb-2 flex size-8 translate-x-1/5 items-center justify-center rounded-[5px_3px_10px_3px] bg-[#AEDCDC]">
              <div className="-translate-x-2/5 -translate-y-1/10">{feature.icon}</div>
            </div>

            <h4 className="mb-2 font-bold text-neutral-600">{feature.title}</h4>

            <p className="text-xs text-neutral-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
