import Image from 'next/image'
import { HeaderNavigation } from '@/features/app'
import contractGuaranteeImg from '@/assets/images/contract_guarantee.svg'
import contractGuaranteeImg01 from '@/assets/images/landing/contract-guarantee/01.png'
import contractGuaranteeImg02 from '@/assets/images/landing/contract-guarantee/02.png'
import contractGuaranteeImg03 from '@/assets/images/landing/contract-guarantee/03.png'
import contractGuaranteeImg04 from '@/assets/images/landing/contract-guarantee/04.png'
import contractGuaranteeImg05 from '@/assets/images/landing/contract-guarantee/05.png'
import contractGuaranteeImg11 from '@/assets/images/landing/contract-guarantee/11.png'
import contractGuaranteeImg12 from '@/assets/images/landing/contract-guarantee/12.png'
import contractGuaranteeImg13 from '@/assets/images/landing/contract-guarantee/13.png'
import contractGuaranteeImg14 from '@/assets/images/landing/contract-guarantee/14.png'
import callIcon from '@/assets/images/landing/contract-guarantee/call-icon.svg'
import Button from '@/components/ui/Button'
import { supportPhones } from '@/features/home'
import CollapseBox from '@/components/ui/CollapseBox'

export default function ContractGuarantee() {
  return (
    <>
      <HeaderNavigation title="ضمانت قرارداد" />
      <div className="px-6">
        <div className="text-center py-6">
          <Image
            src={contractGuaranteeImg.src}
            width={145}
            height={153}
            className="mx-auto mb-[23px]"
            alt=""
          />
          <h2 className="font-bold text-[16px]">ضمانت قرارداد</h2>
          <p className="text-sm text-[#878787]">ضمانت قرارداد چیست؟</p>
        </div>

        <div className="flex flex-col gap-[12px] text-sm mb-6">
          <div className="bg-white shadow-[0_8px_32px_0_#21212114] rounded-[20px] p-4">
            <Image
              src={contractGuaranteeImg01.src}
              width={75}
              height={75}
              className="mx-auto mb-1"
              alt=""
            />
            <p className="font-bold mb-1.5">چه خدمتی ارائه میدید؟</p>
            <p>
              کافیه فقط توی املاین قراردادتون رو بنویسید؛ املاین ضمانت میکنه که اگر مستاجرتون اجاره
              بها رو پرداخت نکرد، املاین اجاره رو پرداخت کنه!
            </p>
          </div>

          <div className="bg-white shadow-[0_8px_32px_0_#21212114] rounded-[20px] p-4">
            <Image
              src={contractGuaranteeImg02.src}
              width={75}
              height={75}
              className="mx-auto mb-1"
              alt=""
            />
            <p className="font-bold mb-1.5">چه شرایطی داره؟</p>
            <ul>
              <li>1- قرارداد در املاین نوشته شده باشه.</li>
              <li>2- مبالغ رهن و اجاره از بستر املاین منتقل شده باشه.</li>
              <li>3- به میزان اجاره بها، مستاجر به املاین سفته داده باشه.</li>
            </ul>
          </div>

          <div className="bg-white shadow-[0_8px_32px_0_#21212114] rounded-[20px] p-4">
            <Image
              src={contractGuaranteeImg03.src}
              width={75}
              height={75}
              className="mx-auto mb-1"
              alt=""
            />
            <p className="font-bold mb-1.5">چرا پول باید تو بستر املاین جا به جا بشه؟</p>
            <ul>
              <li>
                1. املاین بتونه رصد کنه که مستاجر و مالک تعهدات شون رو به درستی انجام داده باشن (پس
                فردا در دادگاه نگه این پولی رو که جا به جا کردم برای موضوعات دیگه بوده و مالک بگه من
                بهش قرض داده بودم و این ربطی به اجاره نداره و...)
              </li>
              <li>
                2. مستاجر پول رو نقدی به مالک پرداخت نکنه که پس فردا مستاجر نگران رسیدهای پرداختی
                باشه و دنبال اثبات کردن واریز کردن پول ها به مالک باشه
              </li>
              <li>
                3. اگر اختلاف مالی بین مالک و مستاجر ایجاد بشه، املاین بتونه تراکنش های هر قرارداد
                رو بررسی کنه و اون اختلاف رو حل کنه
              </li>
            </ul>
          </div>

          <div className="bg-white shadow-[0_8px_32px_0_#21212114] rounded-[20px] p-4">
            <Image
              src={contractGuaranteeImg04.src}
              width={75}
              height={75}
              className="mx-auto mb-1"
              alt=""
            />
            <p className="font-bold mb-1.5">بابت هزینه بیمه مالک و مستاجر چقدر باید پرداخت کنند؟</p>
            <p>
              هیچی!
              <br />
              شما صرفاً همون میزان کمیسیونی که اتحادیه املاک برای املاکی ها مشخص کرده رو پرداخت می
              کنین و حتی یه ریال هم بیشتر بابت تضمین قراردادها پرداخت نمی کنید.
            </p>
          </div>

          <div className="bg-white shadow-[0_8px_32px_0_#21212114] rounded-[20px] p-4">
            <Image
              src={contractGuaranteeImg05.src}
              width={75}
              height={75}
              className="mx-auto mb-1"
              alt=""
            />
            <p className="font-bold mb-1.5">چرا باید مستاجر سفته بده؟</p>
            <p>
              املاین فقط می خواد ضمانت انجام بده و مثل شرکت بیمه ماشین نمی‌خواد برای این خدمتش پولی
              رو دریافت کنه؛ بنابراین اگر مستاجر اجاره رو پرداخت نکنه، املاین مکلفه اون پول رو از
              جیبش پرداخت کنه و باید یه تضمینی وجود داشته باشه که املاین بتونه پولی رو که به مالک از
              طرف مستاجر پرداخت کرده رو پس بگیره...
            </p>
          </div>
        </div>

        <div className="mb-12">
          <p className="text-sm font-extrabold text-center mb-3">
            اگر نیاز به اطلاعات بیشتری دارید، کارشناسان شرکت املاین پاسخگوی شما هستند؛ می تونین با
            تماس و پیام با ما در تماس باشید:
          </p>

          <div className="flex gap-1 justify-center text-sm fa">
            {supportPhones.map((phone) => (
              <a
                key={phone.value}
                href={`tel:${phone.value}`}
                className="bg-white border border-primary rounded-[12px] font-bold pl-5 pr-11 relative p-3"
              >
                <Image
                  src={callIcon.src}
                  alt=""
                  className="absolute right-2 top-2.5"
                  width={19}
                  height={20}
                />
                <span>{phone.text}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-center font-bold text-[16px] mb-6">چرا به املاین اعتماد کنیم؟</p>

          <div className="flex flex-col gap-[12px] text-sm">
            <CollapseBox
              label={
                <div className="flex items-center">
                  <Image
                    src={contractGuaranteeImg11.src}
                    width={40}
                    height={40}
                    className="ml-3"
                    alt=""
                  />
                  <p className="font-bold">بیش از 2 سال سابقه فعالیت</p>
                </div>
              }
              labelClassName="p-4"
              className="bg-white shadow-md rounded-2xl"
              contentClassName="text-sm px-4 pb-4"
            >
              <p className="leading-[20px]">
                املاین یه شرکت معتبر هست که دارای سهامدارن و سرمایه گذارهای سرشناس هستن و اعضای هیات
                مدیره این شرکت کارنامه درخشانی در طول سال ها تجربه خودشون در شرکت های مختلف به جا
                گذاشتن.
              </p>
            </CollapseBox>

            <CollapseBox
              label={
                <div className="flex items-center">
                  <Image
                    src={contractGuaranteeImg12.src}
                    width={40}
                    height={36}
                    className="ml-3"
                    alt=""
                  />
                  <p className="font-bold">همکاری با مشتریان و شرکت‌های بزرگ</p>
                </div>
              }
              labelClassName="p-4"
              className="bg-white shadow-md rounded-2xl"
              contentClassName="text-sm px-4 pb-4"
            >
              <p className="leading-[20px]">
                شرکت های زیادی از جمله باسلام، سلام تامین، ملی پلاست، کاترین پلاست از مشتریان شرکت
                املاین بودند و قراردادهای خود را در بستر املاین منعقد کرده اند.
              </p>
            </CollapseBox>

            <CollapseBox
              label={
                <div className="flex items-center">
                  <Image
                    src={contractGuaranteeImg13.src}
                    width={40}
                    height={46}
                    className="ml-3"
                    alt=""
                  />
                  <p className="font-bold">انعقاد ده ها قرارداد در بستر املاین</p>
                </div>
              }
              labelClassName="p-4"
              className="bg-white shadow-md rounded-2xl"
              contentClassName="text-sm px-4 pb-4"
            >
              <p className="leading-[20px]">
                تا امروز بیش از صد قرارداد در شرکت املاین منعقد شده و کاربران زیادی از خدمات املاین
                استفاده کرده اند.
              </p>
            </CollapseBox>

            <CollapseBox
              label={
                <div className="flex items-center">
                  <Image
                    src={contractGuaranteeImg14.src}
                    width={40}
                    height={40}
                    className="ml-3"
                    alt=""
                  />
                  <p className="font-bold">دارای مجوز از بانک مرکزی و نهادهای نظارتی</p>
                </div>
              }
              labelClassName="p-4"
              className="bg-white shadow-md rounded-2xl"
              contentClassName="text-sm px-4 pb-4"
            >
              <p className="leading-[20px]">
                . پروانه کسب اتحادیه کسب و کارهای مجازی رو داریم که تحت نظارت مستقیم وزارت ارتباطات
                و فناوری اطلاعات هست.
                <br />
                . پروانه کسب ICT یا سازمان نظام صنفی رایانه ای رو داریم که تحت نظر مستقیم وزارت
                ارتباطات و فناوری اطلاعات هست.
                <br />
                . پروانه کسب اتحادیه املاک رو داریم که مستقیماً زیر نظر مسکن، راه و شهرسازی هست.
                <br />
                . مجوز رسمی اینماد رو داریم که مستقماً زیر نظر وزارت صنعت، معدن و کشاورزی هست.
                <br />
                . دارای تاییدیه شاپرک بانک مرکزی هستیم که به صورت امن می تونیم مبالغ منتقل شده بین
                حساب ها رو جا به جا کنیم.
                <br />. همه قراردادهایی که در املاین نوشته میشه، به صورت مستقیم کد رهگیری وزارت راه
                و شهرسازی رو دریافت می کنه که مستقیماً از سامانه دولت دریافت میشه و این یعنی هیچ
                تردیدی در اصالت قراردادهای رهن و اجاره راه نداره...
              </p>
            </CollapseBox>
          </div>
        </div>

        <div>
          <Button className="w-full" href="/contracts/new">
            انعقاد قرارداد
          </Button>
        </div>
      </div>
    </>
  )
}
