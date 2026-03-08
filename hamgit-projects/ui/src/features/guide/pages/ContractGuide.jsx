import React, { useState } from 'react'
import Image from 'next/image'
import { HeaderNavigation } from '@/features/app'
import Button from '@/components/ui/Button'
import StoryViewer from '../components/StoryViewer/StoryViewer'
import tenantGuideImg1 from '@/assets/images/guide/contract/tenant1.png'
import tenantGuideImg2 from '@/assets/images/guide/contract/tenant2.png'
import tenantGuideImg3 from '@/assets/images/guide/contract/tenant3.png'
import tenantGuideImg4 from '@/assets/images/guide/contract/tenant4.png'
import tenantGuideImg5 from '@/assets/images/guide/contract/tenant5.png'
import tenantGuideImg6 from '@/assets/images/guide/contract/tenant6.png'
import tenantGuideImg7 from '@/assets/images/guide/contract/tenant7.png'
import tenantGuideImg8 from '@/assets/images/guide/contract/tenant8.png'
import tenantGuideImg9 from '@/assets/images/guide/contract/tenant9.png'
import tenantGuideImg10 from '@/assets/images/guide/contract/tenant10.png'
import ownerGuideImg1 from '@/assets/images/guide/contract/owner1.png'
import ownerGuideImg2 from '@/assets/images/guide/contract/owner2.png'
import ownerGuideImg3 from '@/assets/images/guide/contract/owner3.png'
import ownerGuideImg4 from '@/assets/images/guide/contract/owner4.png'
import ownerGuideImg5 from '@/assets/images/guide/contract/owner5.png'
import ownerGuideImg6 from '@/assets/images/guide/contract/owner6.png'
import ownerGuideImg7 from '@/assets/images/guide/contract/owner7.png'
import ownerGuideImg8 from '@/assets/images/guide/contract/owner8.png'
import ownerGuideImg9 from '@/assets/images/guide/contract/owner9.png'
import ownerGuideImg10 from '@/assets/images/guide/contract/owner10.png'
import faqImg from '@/assets/images/guide/faq.svg'

const ownerStories = [
  {
    image: ownerGuideImg1.src,
    description: `بعد از اینکه از صفحه اصلی روی گزینه انعقاد قرارداد کلیک میکنی یک صفحه ای رو میبینی که اونجا باید اطلاعات اولیه رو انتخاب کنی.
حواست باشه باید گزینه مالک رو انتخاب کنی و بعدش میری مرحله بعد...`,
  },
  {
    image: ownerGuideImg2.src,
    description: `اینجا همه اطلاعاتیه که باید وارد کنی:
  . اطلاعات مالک که اطلاعات شخصی خودته
  . برای اطلاعات مستاجرم چیز زیادی لازم نیست پر کنی خودش بعدا میاد پر میکنه!
حواست باشه همه اطلاعات اجباری رو وارد کنی!`,
  },
  {
    image: ownerGuideImg3.src,
    description: `توی صفحه اطلاعات ملک اجاره ای باید سه بخش رو پر کنی:
  . مشخصات ملک: که اطلاعات کلی ملک رو میخواد (راستی سند دم دستت باشه چون لازمه عکسشو آپلود کنی)
  . جزئیات ملک
  . امکانات ملک
هر کدومشون اطلاعات اجباری میخوان که باید تکمیلش کنی!`,
  },
  {
    image: ownerGuideImg4.src,
    description: `اینجا صفحه تاریخ و پرداخته:
  . توی بخش اولش تاریخ قراردادتو مشخص میکنی (تاریخ شروع، پایان و وجه التزام ها) وجه التزام پولیه که اگر مستاجر خونه رو دیر بهت برگردونه و یا تو خونه رو دیر بهش بدی یا رهن رو دیر بهش برگردونی، به ازای هر روز قانونا از طرفین گرفته میشه...
  . و بخش بعدی که توی اسلاید بعد بهت توضیح میدم.`,
  },
  {
    image: ownerGuideImg5.src,
    description: `تو این مرحله مبلغ رهن و اجاره رو مشخص میکنی
  . اول مبلغ رهن رو مینویسی و بعد برای پرداخت اون باید با استفاده از گزینه + قسط تعریف کنی. قسط میتونه نقد باشه یا چک. با انتخاب هر کدوم، اطلاعات لازمش رو پر میکنی و وقتی جمع اقساط مستاجرت به اندازه مبلغ رهن شد میتونی این مرحله رو تکمیل کنی.`,
  },
  {
    image: ownerGuideImg6.src,
    description: `اینجا هم اجاره رو مشخص میکنی، اول باید مبلغ اجاره ماهیانه رو وارد کنی حالا با توجه به مبلغ ماهیانه ضرب در تعداد ماه هایی که خونه رو اجاره دادی میتونی چند جور قسط بندی کنی:
  . یا میتونی اجاره رو ماهیانه دریافت کنی که در این صورت فقط کافیه بگی چندم هر ماه میخوای اجاره بگیری
  . یا اقساط نقدی یا چکی تعریف کنی که مبلغ اجاره رو تو چند قسط از مستاجر بگیری!`,
  },
  {
    image: ownerGuideImg7.src,
    description: `حالا دیگه همه اطلاعاتو پر کردی فقط میمونه امضا!
  . روی پیش نویس اجاره نامه میزنی و قراردادت رو میبینی و بعدش باید بری برای امضا کردن.
  . یه امکانی اینجا وجود داره که میتونی به قراردادت بند جدید اضافه کنی یا یه سری از ماده ها رو ویرایش کنی.`,
  },
  {
    image: ownerGuideImg8.src,
    description: `خب دیگه فعلا کار تو تموم شده!
برای مستاجر پیامک میره که قراردادی براش ایجاد شده و باید بیاد اطلاعاتشو پر کنه.
  . اونم مثل تو باید اطلاعات شخصیش رو پر کنه و قرارداد رو همونجوری که تو امضا کردی امضا کنه
  . البته میتونه قرارداد رو رد کنه یا درخواست ویرایش بزنه که در این صورت کارشناس ما باهاتون تماس میگیره و اگر توافق کردید ویرایش رو انجام میده.`,
  },
  {
    image: ownerGuideImg9.src,
    description: `نوبت میرسه به پرداخت کمیسیون!
بعد از اینکه جفتتون امضا کردید باید هر کدوم جداگانه یه مبلغی رو (که کاملا قانونی و کمترین حالت ممکنه) پرداخت کنین!
هم میتونید روی لینکی که براتون پیامک میشه کلیک کنید و هم از بخش قرارداد ها قراردادتون رو انتخاب کنید و توی این صفحه روی پرداخت کمیسیون بزنید.`,
  },
  {
    image: ownerGuideImg10.src,
    description: `و تمام!
به همین راحتی قراردادت رو نوشتی
حالا قراردادت رو کارشناس حقوقی تایید میکنه و بعدش اگر بخوای میتونی کد رهگیری هم بگیری!
بعد از اینکه کارشناس حقوقی قراردادت رو تایید کرد میتونی فایل قراردادت رو هم دانلود کنی که خیالت از همه چیز راحت باشه...`,
  },
]

const tenantStories = [
  {
    image: tenantGuideImg1.src,
    description: `بعد از اینکه از صفحه اصلی روی گزینه انعقاد قرارداد کلیک میکنی یک صفحه ای رو میبینی که اونجا باید اطلاعات اولیه رو انتخاب کنی.
حواست باشه باید گزینه مستاجر رو انتخاب کنی و بعدش میری مرحله بعد...`,
  },
  {
    image: tenantGuideImg2.src,
    description: `اینجا همه اطلاعاتیه که باید وارد کنی:
  • اطلاعات مستاجر که اطلاعات شخصی خودته
  • برای اطلاعات مالک چیز زیادی لازم نیست پر کنی خودش بعدا میاد پر میکنه.
حواست باشه همه اطلاعات اجباری رو وارد کنی!
  • اطلاعات ملک اجاره ای رو مالک باید پر کنه و تو دسترسی بهش نداری.`,
  },
  {
    image: tenantGuideImg3.src,
    description: `اینجا صفحه تاریخ و پرداخته:
  • توی بخش اولش تاریخ قراردادتو مشخص میکنی (تاریخ شروع، پایان و وجه التزام ها) وجه التزام پولیه که اگر تو خونه رو دیر به مالک برگردونی و یا مالک خونه رو دیر بهت بده یا رهن رو دیر بهت برگردونه، به ازای هر روز قانونا از طرفین گرفته میشه...
  • و بخش بعدی که توی اسلاید بعد بهت توضیح میدم.`,
  },
  {
    image: tenantGuideImg4.src,
    description: `تو این مرحله مبلغ رهن و اجاره رو مشخص میکنی
  • اول مبلغ رهن رو مینویسی و بعد برای پرداخت اون باید با استفاده از گزینه + قسط تعریف کنی. قسط میتونه نقد باشه یا چک. با انتخاب هر کدوم، اطلاعات لازمش رو پر میکنی و وقتی جمع اقساطت به اندازه مبلغ رهن شد میتونی این مرحله رو تکمیل کنی.`,
  },
  {
    image: tenantGuideImg5.src,
    description: `اینجا هم اجاره رو مشخص میکنی، اول باید مبلغ اجاره ماهیانه رو وارد کنی حالا با توجه به مبلغ ماهیانه ضرب در تعداد ماه هایی که خونه رو اجاره کردی میتونی چند جور قسط بندی کنی:
  • یا میتونی اجاره رو ماهیانه پرداخت کنی که در این صورت فقط کافیه بگی چندم هر ماه میخوای اجاره بدی.
  • یا اقساط نقدی یا چکی تعریف کنی که مبلغ اجاره رو تو چند قسط به مالک بدی!`,
  },
  {
    image: tenantGuideImg6.src,
    description: `حالا دیگه همه اطلاعاتو پر کردی
    . چون هنوز مالک اطلاعات خودش و ملک رو وارد نکرده نمیتونی قرارداد رو ببینی برای همین باید قرارداد رو بفرستی سمت مالک که اون اطلاعات و پر کنه.`,
  },
  {
    image: tenantGuideImg7.src,
    description: `خب دیگه فعلا کار تو تموم شده!
برای مالک پیامک میره که قراردادی براش ایجاد شده و باید بیاد اطلاعاتشو پر کنه.
  • اونم مثل تو باید اطلاعات شخصیش رو پر کنه و همچنین اطلاعات ملک اجاره ای رو وارد کنه و بعدش قرارداد رو امضا کنه.
  • البته میتونه قرارداد رو رد کنه یا درخواست ویرایش بزنه که در این صورت کارشناس ما باهاتون تماس میگیره و اگر توافق کردید ویرایش رو انجام میده.`,
  },
  {
    image: tenantGuideImg8.src,
    description: `بعد از اینکه مالک اطلاعاتشو پر کرد و قرارداد رو امضا کرد نوبت شماست که قرارداد رو امضا کنی!
  • روی امضای مستاجر میزنی و قرارداد رو میبینی و اطلاعاتی که مالک پر کرده رو نگاه میکنی و اگر تایید میکردی میری امضا میکنی
  • البته میتونی قرارداد رو رد یا ویرایش کنی
  • برای امضا یه کد برات میاد و اون کد رو وارد میکنی و امضات انجام میشه`,
  },
  {
    image: tenantGuideImg9.src,
    description: `نوبت میرسه به پرداخت کمیسیون!
بعد از اینکه جفتتون امضا کردید باید هر کدوم جداگانه یه مبلغی رو (که کاملا قانونی و کمترین حالت ممکنه) پرداخت کنین!
هم میتونید روی لینکی که براتون پیامک میشه کلیک کنید و هم از بخش قرارداد ها قراردادتون رو انتخاب کنید و توی این صفحه روی پرداخت کمیسیون بزنید.`,
  },
  {
    image: tenantGuideImg10.src,
    description: `و تمام!
به همین راحتی قراردادت رو نوشتی
حالا قراردادت رو کارشناس حقوقی تایید میکنه و بعدش اگر بخوای میتونی کد رهگیری هم بگیری
بعد از اینکه کارشناس حقوقی قراردادت رو تایید کرد میتونی فایل قراردادت رو هم دانلود کنی که خیالت از همه چیز راحت باشه...`,
  },
]

const stories = {
  owner: ownerStories,
  tenant: tenantStories,
}

export default function ContractGuide() {
  const [type, setType] = useState()

  return (
    <>
      <HeaderNavigation title="راهنمای انعقاد قرارداد" />
      {!type ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-[340px] w-full flex flex-col items-center gap-6 px-5 py-4 border border-gray-200 bg-white rounded-xl">
            <Image src={faqImg.src} width={45} height={45} className="text-center mt-2" alt="faq" />

            <p className="text-center text-gray-900">مالک هستی یا مستاجر؟</p>

            <div className="flex items-center w-full gap-3">
              <Button className="w-full" onClick={() => setType('owner')}>
                مالک
              </Button>
              <Button className="w-full" variant="outline" onClick={() => setType('tenant')}>
                مستاجر
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <StoryViewer stories={stories[type]} />
      )}
    </>
  )
}
