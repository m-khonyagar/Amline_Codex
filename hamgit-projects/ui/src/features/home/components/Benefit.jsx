import React from 'react'
import Image from 'next/image'
import badge from '@/assets/images/home-banners/badge.png'
import clock from '@/assets/images/home-banners/clock.png'
import cash from '@/assets/images/home-banners/cash.png'
import onlinePayment from '@/assets/images/home-banners/online_payment.png'
import legalSystem from '@/assets/images/home-banners/legal_system.png'

export default function Benefit({ className }) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-14">
        <div className="flex items-center gap-4">
          <Image width={100} height={100} src={badge.src} alt="badge" />

          <div>
            <h3 className="font-semibold">قراردادت رو ضمانت کن</h3>
            <p className="text-sm text-gray-500 leading-6">
              اگه مستاجرت به هر دلیلی اجاره بهاش رو پرداخت نکنه، املاین پرداخت میکنه!
            </p>
          </div>
        </div>

        <div className="flex flex-row-reverse items-center gap-4">
          <Image width={100} height={100} src={clock.src} alt="clock" />

          <div className="text-left">
            <h3 className="font-semibold fa">7 روز هفته، 24 ساعت</h3>
            <p className="text-sm text-gray-500 leading-6">
              تو هر ساعت از شبانه روز زیر ده دقیقه میتونی قرارداد بنویسی.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Image width={100} height={100} src={cash.src} alt="cash" />

          <div>
            <h3 className="font-semibold">حق کمیسیون شفاف و قانونی</h3>
            <p className="text-sm text-gray-500 leading-6">
              املاین حداقل کمیسیون قانونی رو دریافت میکنه که مصوب اتحادیه مشاوران املاک هست.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-7">
        <div className="flex flex-col p-4 bg-[#D6E8C8] rounded-2xl">
          <h3 className="font-semibold text-lg mb-3.5">بدون هیچ کاری، کدرهگیری بگیر!</h3>
          <p>
            بعد از اینکه قراردادت رو توی املاین نوشتی، بدون اینکه هیچ کاری بکنی ما برات کد رهگیری
            رسمی وزارت مسکن، راه و شهرسازی رو میگیریم تا خیالت از همه چیز راحت باشه.
          </p>
          <Image
            width={156}
            height={156}
            src={onlinePayment.src}
            alt="online payment"
            className="mx-auto mt-4"
          />
        </div>

        <div className="flex flex-col p-4 bg-[#CEDCDF] rounded-2xl">
          <h3 className="font-semibold text-lg mb-3.5">داوری</h3>
          <p>
            در صورتی که خدایی نکرده اختلافی بین مالک و مستاجر پیش بیاد، مرجع رسیدگی به اون اختلاف
            تیم حقوقی املاینه و دیگه نیازی نیست پله‌های دادگاهو بالا پایین بشین!
          </p>
          <Image
            width={156}
            height={156}
            src={legalSystem.src}
            alt="legal system"
            className="mx-auto mt-4"
          />
        </div>
      </div>
    </div>
  )
}
