import React from 'react'
import Image from 'next/image'
import { HeaderNavigation } from '@/features/app'
import trustImg1 from '@/assets/images/landing/trust/1.png'
import trustImg2 from '@/assets/images/landing/trust/2.png'
import trustImg3 from '@/assets/images/landing/trust/3.png'
import trustImg4 from '@/assets/images/landing/trust/4.png'
import trustImg5 from '@/assets/images/landing/trust/5.png'
import trustImg6 from '@/assets/images/landing/trust/6.png'
import trustImg7 from '@/assets/images/landing/trust/7.png'
import trustImg8 from '@/assets/images/landing/trust/8.png'
import trustImg9 from '@/assets/images/landing/trust/9.png'
import trustImg10 from '@/assets/images/landing/trust/10.png'
import CollapseBox from '@/components/ui/CollapseBox'

export default function TrustPage() {
  return (
    <div>
      <HeaderNavigation title="چطور اعتماد کنم؟" href="/" />

      <div className="px-8 mt-7">
        <h1 className="text-center text-lg font-medium mb-5">چطور به املاین اعتماد کنم؟</h1>

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
              املاین مجوز اینماد وزارت صمت رو داره! این یعنی تمام بالاترین نظارت هایی که ممکن هست
              روی یک سایت انجام بشه، از طرف وزارت صمت در حال انجام میشه و خیالتون راحت باشه که انقدر
              امنیت در بستر املاین بالا هست که می‌تونین راحت تراکنش هاتون رو در بستر املاین انجام
              بدید.
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
              تمام قراردادهایی که در املاین توسط طرفین منعقد میشه، توسط تیم حقوقی املاین بررسی میشه
              و تا زمانی که از انجام معامله امن در املاین مطمئن نشیم، قرارداد منعقد نمیشه.
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
              املاین مشورت کنین و کارشناسان تیم پشتیبانی املاین، تمام مسائل و دغدغه هاتون رو در
              اولین فرصت پیگیری و حل می کنن.
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

          <CollapseBox
            label={
              <div className="flex items-center">
                <Image src={trustImg5.src} width={60} height={60} className="ml-3" alt="" />
                <p className="font-bold text-sm">پرداخت امن از طریق درگاه رسمی بانک</p>
              </div>
            }
            labelClassName="p-4"
            className="bg-white shadow-md rounded-2xl"
            contentClassName="text-sm px-4 pb-4"
          >
            <p>
              اگر نگران هستید که پول رهن رو به مستاجر برگردونید یا اگر مستاجر هستید پول رو به مالک
              برگردونی ولی طرف مقابل زیر بار پرداخت رهن یا اجاره نره، می تونی با پرداخت امن از درگاه
              های امن بانکی املاین، خیالت برای همیشه راحت باشه که دیگه هیچ وقت نمی تونه طرف مقابل
              بزن زیر پول‌های واریزی و نمی تونه دَبِه در بیاره.
            </p>
          </CollapseBox>

          <CollapseBox
            label={
              <div className="flex items-center">
                <Image src={trustImg6.src} width={60} height={60} className="ml-3" alt="" />
                <p className="font-bold text-sm">تضمین هویت افراد در معامله</p>
              </div>
            }
            labelClassName="p-4"
            className="bg-white shadow-md rounded-2xl"
            contentClassName="text-sm px-4 pb-4"
          >
            <p>
              تمام افرادی که در املاین قرارداد می نویسن، توسط سامانه شاهاکار وزارت ارتباطات دولت،
              استعلام گرفته میشن و نمی ذاریم کسی در این بستر کلاهبرداری کنه و حواس مون به همه چی
              هست!
            </p>
          </CollapseBox>

          <CollapseBox
            label={
              <div className="flex items-center">
                <Image src={trustImg7.src} width={60} height={60} className="ml-3" alt="" />
                <p className="font-bold text-sm">نظارت و بررسی مدام طرفین قرارداد</p>
              </div>
            }
            labelClassName="p-4"
            className="bg-white shadow-md rounded-2xl"
            contentClassName="text-sm px-4 pb-4"
          >
            <p>
              ما به صورت حرفه ای قراردادهایی که در بستر املاین منعقد میشه رو نظارت می کنیم و اگر
              مستاجر یا مالکی پول طرف مقابل رو به هر دلیلی پرداخت نکنه، پیگیری می کنیم و اجازه نمی
              دیم حق کسی ضایع بشه.
            </p>
          </CollapseBox>

          <CollapseBox
            label={
              <div className="flex items-center">
                <Image src={trustImg8.src} width={60} height={60} className="ml-3" alt="" />
                <p className="font-bold text-sm">بیش از 2 سال سابقه فعالیت</p>
              </div>
            }
            labelClassName="p-4"
            className="bg-white shadow-md rounded-2xl"
            contentClassName="text-sm px-4 pb-4"
          >
            <p>
              املاین یه شرکت معتبر هست که دارای سهامدارن و سرمایه گذارهای سرشناس هستن و اعضای هیات
              مدیره این شرکت کارنامه درخشانی در طول سال ها تجربه خودشون در شرکت های مختلف به جا
              گذاشتن.
            </p>
          </CollapseBox>

          <CollapseBox
            label={
              <div className="flex items-center">
                <Image src={trustImg9.src} width={60} height={60} className="ml-3" alt="" />
                <p className="font-bold text-sm">انعقاد ده ها قرارداد در بستر املاین</p>
              </div>
            }
            labelClassName="p-4"
            className="bg-white shadow-md rounded-2xl"
            contentClassName="text-sm px-4 pb-4"
          >
            <p>
              تا امروز بیش از صد قرارداد در شرکت املاین منعقد شده و کاربران زیادی از خدمات املاین
              استفاده کرده اند.
            </p>
          </CollapseBox>

          <CollapseBox
            label={
              <div className="flex items-center">
                <Image src={trustImg10.src} width={60} height={60} className="ml-3" alt="" />
                <p className="font-bold text-sm">همکاری با مشتریان و شرکت‌های بزرگ</p>
              </div>
            }
            labelClassName="p-4"
            className="bg-white shadow-md rounded-2xl"
            contentClassName="text-sm px-4 pb-4"
          >
            <p>
              شرکت های زیادی از جمله باسلام، سلام تامین، ملی پلاست، کاترین پلاست از مشتریان شرکت
              املاین بودند و قراردادهای خود را در بستر املاین منعقد کرده اند.
            </p>
          </CollapseBox>
        </div>
      </div>
    </div>
  )
}
