import { env } from '@/config/env'
import { HowToWriteContractSteps, type Step } from '@/components/HowToWriteContractSteps'

const steps: Step[] = [
  {
    number: '1',
    title: 'ورود به پنل مشاور املاک',
    description: (
      <>
        از{' '}
        <a
          href={`${env.APP_URL}/auth/realtor`}
          className="text-blue-500 transition-all hover:underline"
        >
          اینجا
        </a>{' '}
        به عنوان مشاور املاک در املاین ثبت‌نام کنید و وارد پنل اختصاصی خود شوید.
      </>
    ),
  },
  {
    number: '2',
    title: 'تکمیل اطلاعات ملک و طرفین قرارداد',
    description: 'پس از تکمیل اطلاعات طرفین و احراز هویت، جزئیات ملک مورد معامله را وارد کنید.',
  },
  {
    number: '3',
    title: 'امضای دیجیتال، تایید قرارداد و صدور کد رهگیری',
    description:
      'پس از امضای دیجیتال طرفین، کارشناس حقوقی قرارداد را بررسی و تایید می‌کند و در نهایت کد رهگیری از وزارت راه و شهرسازی برای قرارداد صادر می‌شود.',
  },
  {
    number: '4',
    title: 'دریافت قرارداد نهایی و آرشیو امن',
    description:
      'فایل PDF قرارداد پس از امضای طرفین قابل دانلود است. همچنین فایل تمامی قراردادهای بسته شده در پنل اختصاصی شما به‌صورت امن نگهداری می‌شوند.',
  },
]

export const RealtorHowToWriteContract = ({ className }: { className?: string }) => {
  return (
    <HowToWriteContractSteps
      title="چطور در املاین قرارداد بنویسیم؟"
      steps={steps}
      className={className}
    />
  )
}
