import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CollapseBox from '@/components/ui/CollapseBox'
import trustImg1 from '@/assets/images/landing/trust/1.png'
import trustImg2 from '@/assets/images/landing/trust/2.png'
import trustImg3 from '@/assets/images/landing/trust/3.png'
import trustImg4 from '@/assets/images/landing/trust/4.png'
import { ChevronLeftIcon } from '@/components/icons'
import { cn } from '@/utils/dom'

export default function HowCanTrust({ className }) {
  return (
    <div className={cn('mx-6', className)}>
      <h3 className="font-medium text-center text-lg mb-6">چطور به املاین اعتماد کنم؟</h3>

      <div className="flex flex-col gap-4">
        <CollapseBox
          label={
            <div className="flex items-center">
              <Image src={trustImg1.src} width={60} height={60} className="ml-3" alt="" />
              <p className="font-bold text-sm">دارای مجوز اتحادیه‌ها و وزارت صمت</p>
            </div>
          }
          labelClassName="p-4"
          className="bg-white shadow-md rounded-2xl"
          contentClassName="text-sm px-4 pb-4"
        >
          <p>
            املاین یه شرکتی هست که هم از اتحادیه کسب و کارهای مجازی و هم از اتحادیه املاک کشور
            پروانه داره و مجوز فعالیت گرفته و مدام توسط بازرسان این دو اتحادیه کنترل میشه. همچنین
            املاین مجوز اینماد وزارت صمت رو داره! این یعنی تمام بالاترین نظارت هایی که ممکن هست روی
            یک سایت انجام بشه، از طرف وزارت صمت در حال انجام میشه و خیالتون راحت باشه که انقدر امنیت
            در بستر املاین بالا هست که می‌تونین راحت تراکنش هاتون رو در بستر املاین انجام بدید.
          </p>
        </CollapseBox>

        <CollapseBox
          label={
            <div className="flex items-center">
              <Image src={trustImg2.src} width={60} height={60} className="ml-3" alt="" />
              <p className="font-bold text-sm">بررسی تمام قراردادها توسط کارشناس حقوقی</p>
            </div>
          }
          labelClassName="p-4"
          className="bg-white shadow-md rounded-2xl"
          contentClassName="text-sm px-4 pb-4"
        >
          <p>
            تمام قراردادهایی که در املاین توسط طرفین منعقد میشه، توسط تیم حقوقی املاین بررسی میشه و
            تا زمانی که از انجام معامله امن در املاین مطمئن نشیم، قرارداد منعقد نمیشه.
          </p>
        </CollapseBox>

        <CollapseBox
          label={
            <div className="flex items-center">
              <Image src={trustImg3.src} width={60} height={60} className="ml-3" alt="" />
              <p className="font-bold text-sm">پشتیبانی و پیگیری تیم املاین</p>
            </div>
          }
          labelClassName="p-4"
          className="bg-white shadow-md rounded-2xl"
          contentClassName="text-sm px-4 pb-4"
        >
          <p>
            اگر هر چالش و سوال و ابهامی در مورد نوشتن قرارداد داشته باشید، می تونین با تیم حرفه ای
            املاین مشورت کنین و کارشناسان تیم پشتیبانی املاین، تمام مسائل و دغدغه هاتون رو در اولین
            فرصت پیگیری و حل می کنن.
          </p>
        </CollapseBox>

        <CollapseBox
          label={
            <div className="flex items-center">
              <Image src={trustImg4.src} width={60} height={60} className="ml-3" alt="" />
              <p className="font-bold text-sm">تضمین پرداخت اجاره بها</p>
            </div>
          }
          labelClassName="p-4"
          className="bg-white shadow-md rounded-2xl"
          contentClassName="text-sm px-4 pb-4"
        >
          <p>
            در صورتی که قراردادها رو در املاین تدوین کنین، املاین تضمین می کنه که اگر به هر دلیلی
            مستاجر در زمان مقرر از پرداخت اجاره بها، امتناع کرد، املاین اجاره بها رو به شما پرداخت
            می کنه.
          </p>
        </CollapseBox>
      </div>

      <Link href="/landing/trust" className="mt-6 flex items-center gap-1 text-blue-600">
        مشاهده بیشتر
        <ChevronLeftIcon size={20} />
      </Link>
    </div>
  )
}
