import { HowToWriteContractSteps, type Step } from '@/components/HowToWriteContractSteps'

const steps: Step[] = [
  {
    number: '1',
    title: 'تکمیل اطلاعات طرفین',
    description:
      'اطلاعات هویتی، شماره تماس، کد ملی و آدرس هر دو طرف قرارداد ثبت شده و احراز هویت انجام می‌شود.',
  },
  {
    number: '2',
    title: 'اسکن سند و تکمیل اطلاعات ملک',
    description: 'تصویر سند ملک، نوع ملک، متراژ، طبقه، تعداد اتاق‌ها و سایر مشخصات ملک ثبت می‌شود.',
  },
  {
    number: '3',
    title: 'تاریخ و مبلغ قرارداد',
    description:
      'بازه زمانی قرارداد، مبلغ اجاره، ودیعه و نحوه پرداخت (چک یا نقد) توسط کاربر تعیین می‌شود.',
  },
  {
    number: '4',
    title: 'امضای قرارداد توسط طرفین قرارداد',
    description: 'پس از تأیید نهایی متن قرارداد، طرفین قرارداد را به‌صورت دیجیتال امضا می‌کنند.',
  },
  {
    number: '5',
    title: 'تایید کارشناس و صدور کد رهگیری',
    description:
      'پس از تایید قرارداد توسط کارشناس حقوقی کد رهگیری قرارداد به صورت رایگان صادر می‌شود.',
  },
  {
    number: '6',
    title: 'ارسال قرارداد به‌صورت فیزیکی',
    description:
      'پس از تایید قرارداد توسط کارشناس حقوقی کد رهگیری قرارداد به صورت رایگان صادر می‌شود.',
  },
]

export const RentHowToWriteContract = ({ className }: { className?: string }) => {
  return (
    <HowToWriteContractSteps
      title="چطور در املاین قرارداد بنویسیم؟"
      steps={steps}
      className={className}
    />
  )
}
