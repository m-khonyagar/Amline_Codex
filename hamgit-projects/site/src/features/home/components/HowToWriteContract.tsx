import { HowToWriteContractSteps, type Step } from '@/components/HowToWriteContractSteps'

const steps: Step[] = [
  {
    number: '1',
    title: 'تکمیل اطلاعات مالک و مستاجر',
    description:
      'اطلاعات شناسنامه‌ای، شماره تماس، کد ملی و آدرس مالک و مستاجر ثبت شده و احراز هویت پایه‌ای انجام می‌شود.',
  },
  {
    number: '2',
    title: 'اسکن سند و تکمیل اطلاعات ملک',
    description:
      'تصویر سند مالکیت، نوع ملک، متراژ، طبقه، تعداد اتاق‌ها و سایر مشخصات ملک ثبت می‌شود.',
  },
  {
    number: '3',
    title: 'تاریخ و مبلغ قرارداد',
    description:
      'بازه زمانی قرارداد، مبلغ اجاره، رهن و نحوه پرداخت (چک یا نقد) توسط کاربر تعیین می‌شود.',
  },
  {
    number: '4',
    title: 'امضای قرارداد توسط مالک و مستأجر',
    description:
      'پس از تأیید نهایی متن، طرفین با ارسال کد، قرارداد را به‌صورت دیجیتال امضا می‌کنند.',
  },
  {
    number: '5',
    title: 'تایید کارشناس و صدور کد رهگیری',
    description:
      'بعد از امضای قرارداد کارشناس حقوقی، قرارداد شما را تایید کرده و کد رهگیری شما به صورت رایگان دریافت می‌شود.',
  },
]

export const HowToWriteContract = ({ className }: { className?: string }) => {
  return (
    <HowToWriteContractSteps
      title="چطوری با املاین قرارداد بنویسیم؟"
      steps={steps}
      className={className}
    />
  )
}
