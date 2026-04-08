import { RealtorHero } from '../components/RealtorHero'
import { RealtorBenefit } from '../components/RealtorBenefit'
import { RealtorHowToWriteContract } from '../components/RealtorHowToWriteContract'
import { SampleContract } from '../components/SampleContract'
import { RealtorContractCTA } from '../components/RealtorContractCTA'
import { RealtorFeedback } from '../components/RealtorFeedback'
import { FAQ } from '@/components/FAQ'

const questions = [
  {
    label: 'آیا قرارداد تنظیم‌شده آنلاین معتبر و قانونی است؟',
    answer:
      'بله، قراردادهای املاین تحت نظارت حقوقی تنظیم شده و با صدور کد رهگیری، دارای اعتبار قانونی هستند.',
  },
  {
    label: 'آیا نیاز به امضای حضوری است؟',
    answer:
      'خیر، هدف املاین حذف نیاز به امضای فیزیکی و صرفه‌جویی در وقت شماست. امضای دیجیتال جایگزین قانونی امضای حضوری است.',
  },
  {
    label: 'آیا امضای دیجیتال قانونی است؟',
    answer:
      'بله، امضای دیجیتال در چارچوب قانون تجارت الکترونیک کاملاً معتبر است و تضمین‌کننده هویت طرفین معامله است.',
  },
  {
    label: 'چقدر زمان می‌برد تا قرارداد آماده شود؟',
    answer:
      'تنظیم یک قرارداد کامل و دریافت کد رهگیری، به سرعت شما بستگی دارد و معمولا کمتر از چند دقیقه طول می‌کشد.',
  },
  {
    label: 'آیا می‌توان قرارداد را بعد از تحویل ویرایش کرد؟',
    answer:
      'قرارداد بعد از امضای نهایی و صدور کد رهگیری قابل ویرایش نیست (مانند قراردادهای کاغذی)؛ اما پیش از امضا، ویرایش امکان پذیر است.',
  },
  {
    label: 'آیا قرارداد باید در سامانه املاک ثبت شود؟',
    answer:
      'با ثبت قرارداد در املاین، در واقع مراحل قانونی ثبت و صدور کد رهگیری به‌صورت همزمان انجام می‌گیرد.',
  },
  {
    label: 'هزینه تنظیم قرارداد چقدر است؟',
    answer:
      'هدیه املاین به مشاورین املاک، حذف کمیسیون از اولین قرارداد است. در قراردادهای بعدی، هر قرارداد رهن و اجاره مشمول 290 هزار تومان کمیسیون و هر قرارداد خرید و فروش مشمول 990 هزار تومان کمیسیون خواهد بود.',
  },
]

export function RealtorPage() {
  return (
    <>
      <RealtorHero />
      <RealtorBenefit className="mt-20 sm:mt-24 md:mt-28 lg:mt-32" />
      <RealtorHowToWriteContract className="mt-20 sm:mt-24 md:mt-28 lg:mt-32" />
      {/* <RealtorStats className="mt-20 sm:mt-24 md:mt-28 lg:mt-32" /> */}
      <SampleContract className="mt-20 sm:mt-24 md:mt-28 lg:mt-32" />
      <RealtorContractCTA className="mt-20 sm:mt-24 md:mt-28 lg:mt-32" />
      <RealtorFeedback className="mt-20 max-md:pb-12 sm:mt-24 md:mt-28 lg:mt-32" />
      <FAQ questions={questions} className="mt-20 pb-12 sm:mt-24 md:mt-28 lg:mt-32" />
    </>
  )
}
