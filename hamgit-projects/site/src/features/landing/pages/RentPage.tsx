import { RentHero } from '../components/RentHero'
import { RentHowToWriteContract } from '../components/RentHowToWriteContract'
import { RentDiscount } from '../components/RentDiscount'
import { RentBenefit } from '../components/RentBenefit'
import { RentCommission } from '../components/RentCommission'
import { SampleContract } from '../components/SampleContract'
import { RentReadyContract } from '../components/RentReadyContract'
import { FAQ } from '@/components/FAQ'

const questions = [
  {
    label: 'آیا قرارداد تنظیم‌شده آنلاین معتبر و قانونی است؟',
    answer: 'بله، تمامی قراردادهای املاین از نظر حقوقی بررسی و قابل استناد در مراجع قانونی هستند.',
  },
  {
    label: 'آیا امضای دیجیتال قانونی است؟',
    answer: 'بله، امضای دیجیتال دارای اعتبار قانونی طبق قانون تجارت الکترونیکی ایران است.',
  },
  { label: 'چقدر زمان می‌برد تا قرارداد آماده شود؟', answer: 'به طور میانگین کمتر از ۱۰ دقیقه.' },
  {
    label: 'آیا می‌توان قرارداد را بعد از تحویل ویرایش کرد؟',
    answer: 'بله، تا قبل از امضا امکان ویرایش وجود دارد.',
  },
  {
    label: 'آیا قرارداد باید در سامانه املاک ثبت شود؟',
    answer: 'بر اساس الزامات قانونی موجود، ثبت در سامانه رسمی نیز قابل انجام است.',
  },
  {
    label: 'آیا نیاز به امضای حضوری است؟',
    answer: 'خیر، با امضای دیجیتال معتبر نیازی به حضور فیزیکی نیست.',
  },
  {
    label: 'هزینه تنظیم قرارداد چقدر است؟',
    answer:
      'هزینه تنظیم قرارداد در حال حاضر برای رهن و اجاره 290 هزار تومان از هر یک از طرفین است.',
  },
]

export function RentPage() {
  return (
    <>
      <RentHero />
      <RentHowToWriteContract className="mt-20 sm:mt-24 md:mt-28 lg:mt-32" />
      <RentDiscount className="mt-20 sm:mt-24 md:mt-28 lg:mt-32" />
      <RentBenefit className="mt-20 sm:mt-24 md:mt-28 lg:mt-32" />
      <RentCommission className="mt-20 sm:mt-24 md:mt-28 lg:mt-32" />
      <SampleContract className="mt-20 sm:mt-24 md:mt-28 lg:mt-32" />
      <RentReadyContract className="mt-20 sm:mt-24 md:mt-28 lg:mt-32" />
      <FAQ questions={questions} className="my-20 sm:my-28 md:my-32" />
    </>
  )
}
