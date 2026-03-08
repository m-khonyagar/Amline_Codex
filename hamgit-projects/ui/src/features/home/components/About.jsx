import { cn } from '@/utils/dom'
import { Image } from '@/components/ui/Image'
import contractGuaranteeImg01 from '@/assets/images/landing/contract-guarantee/01.png'
import contractGuaranteeImg02 from '@/assets/images/landing/contract-guarantee/02.png'
import contractGuaranteeImg03 from '@/assets/images/landing/contract-guarantee/03.png'
import contractGuaranteeImg04 from '@/assets/images/landing/contract-guarantee/04.png'

function About({ className }) {
  return (
    <div className={cn(className)}>
      <div className="rounded-3xl shadow-xl p-4 bg-white">
        <Image src={contractGuaranteeImg01.src} ratio={1} className="mx-auto mb-1 w-24" />

        <h3 className="font-semibold text-sm md:text-base">املاین چی کار می‌کنه؟</h3>
        <p className="mt-2 text-justify text-sm md:text-base leading-relaxed fa">
          کافیه فقط تو سایت املاین قراردادتون رو بنویسید؛ اون‌وقته که اگه مستاجرتون اجاره‌بها رو
          پرداخت نکرد، املاین به جاش پرداخت می‌کنه!
        </p>
      </div>

      <div className="mt-4 rounded-3xl shadow-xl p-4 bg-white">
        <Image src={contractGuaranteeImg02.src} ratio={1} className="mx-auto mb-1 w-24" />

        <h3 className="font-semibold text-sm md:text-base">چه شرایطی داره؟</h3>
        <p className="mt-2 text-justify text-sm md:text-base leading-relaxed fa">
          1- قرارداد در املاین نوشته شده باشه.
          <br />
          2- مبلغ رهن، 6 ماه از مبلغ اجاره رو پوشش بده.
          <br />
          3- مبالغ رهن و اجاره از بستر املاین منتقل شده باشه.
        </p>
      </div>

      <div className="mt-4 rounded-3xl shadow-xl p-4 bg-white">
        <Image src={contractGuaranteeImg03.src} ratio={1} className="mx-auto mb-1 w-24" />

        <h3 className="font-semibold text-sm md:text-base">
          چرا پول باید تو بستر املاین جا به جا بشه؟
        </h3>
        <p className="mt-2 text-justify text-sm md:text-base leading-relaxed fa">
          1- املاین بتونه رصد کنه که مستاجر و مالک تعهدات‌شون رو به درستی انجام داده باشن (پس فردا
          مستاجر نگه این پولی رو که جابه‌جا کردم برای موضوعات دیگه بوده و یا مالک بگه بهش قرض داده
          بودم و ربطی به اجاره نداره و...).
          <br />
          2- مستاجر پول رو نقدی به مالک پرداخت نکنه که بعدا نگران رسیدهای پرداختی و دنبال اثبات کردن
          واریزی‌ها به مالک باشه.
          <br />
          3- اگر اختلاف مالی بین مالک و مستاجر ایجاد بشه، املاین بتونه تراکنش‌های هر قرارداد رو
          بررسی کنه و اون اختلاف رو حل کنه.
        </p>
      </div>

      <div className="mt-4 rounded-3xl shadow-xl p-4 bg-white">
        <Image src={contractGuaranteeImg04.src} ratio={1} className="mx-auto mb-1 w-24" />

        <h3 className="font-semibold text-sm md:text-base">
          بابت هزینه بیمه مالک و مستاجر چقدر باید پرداخت کنند؟
        </h3>
        <p className="mt-2 text-justify text-sm md:text-base leading-relaxed fa">
          هیچی!
          <br />
          شما صرفاً همون میزان کمیسیونی که اتحادیه املاک برای املاکی ها مشخص کرده رو پرداخت می‌کنین
          و حتی یه ریال هم بیشتر بابت تضمین قراردادها پرداخت نمی‌کنین.
        </p>
      </div>
    </div>
  )
}

export default About
