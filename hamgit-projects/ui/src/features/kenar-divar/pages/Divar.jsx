import React, { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import publicRuntimeConfig from '@/configs/public-runtime-config.mjs'
import { useAuthContext } from '@/features/auth'
import { useGuideContext } from '@/features/guide'
import { generateRandomString } from '@/utils/string'
import { handleErrorOnSubmit } from '@/utils/error'
import useDivarLogin from '../api/divar-login-oauth'
import { toast } from '@/components/ui/Toaster'
import { useDivarRentalCommission, useRentalCommission } from '@/features/commission'
import { Form, InputNumberField, useForm } from '@/components/ui/Form'
import { Footer } from '@/features/home'
import CollapseBox from '@/components/ui/CollapseBox'
import Button from '@/components/ui/Button'
import { numberSeparator } from '@/utils/number'
import { CopyIcon, InfoIcon, SupportIcon, TomanIcon } from '@/components/icons'

import onlineContract from '@/assets/images/landing/divar/online-contract.svg'
import secureContract from '@/assets/images/landing/divar/secure-contract.svg'
import errorWarning from '@/assets/images/landing/error-warning.png'

const contractSteps = [
  { number: '1', text: 'تکمیل اطلاعات طرفین' },
  { number: '2', text: 'اسکن سند و تکمیل اطلاعات ملک' },
  { number: '3', text: 'تاریخ و مبلغ قرارداد' },
  { number: '4', text: 'امضای قرارداد و پرداخت کمیسیون توسط طرفین' },
  { number: '5', text: 'تایید کارشناس و صدور کد رهگیری' },
  { number: '6', text: 'ارسال قرارداد به‌صورت فیزیکی' },
]

const questions = [
  {
    label: 'چرا در املاین قرارداد بنویسم؟',
    answer:
      '1- در کمتر از 7 دقیقه قرارداد بنویس و دیگه نیازی نیست برای قرارداد اجاره به صورت حضوری به دفاتر املاک مراجعه کنی.\n\n2- می‌تونی بدون اینکه هزینه بیشتری پرداخت کنی، از تضمین پرداخت اجاره بها استفاده کنی! یعنی اگر به هر دلیلی مستاجر نتونست اجاره رو پرداخت کنه، املاین مبلغ اجاره رو به مالک میده و بعداً از مستاجر اجاره رو دریافت می‌کنه.\n\n3- دیگه برای جا‌به‌جایی مبالغ رهن و اجاره نیاز نیست تا بانک بری! می‌تونی به صورت آنلاین و امن واریز کنی.\n\n4- کد رهگیری قرارداد رو هم به صورت آنلاین دریافت می‌کنی و دیگه نیاز نیست به سامانه‌های دیگه مراجعه کنی!\n\n5- مورد تایید قوه قضاییه هستم و خیالت از اعتبار قرارداد راحته!',
  },
  {
    label: 'برای اجاره‌نامه باید حتما کد رهگیری بگیرم؟',
    answer:
      'بله؛ قانون الزامی کرده، هر چند برخی افراد از دریافت این کد رهگیری امتناع می کنن\n کد رهگیری مزیت های زیادی داره از جمله اینکه:\n\n1- قراردادهای با کد رهگیری از نظر دولت رسمیت داره و امکان ادعای جعل در اون ها پذیرفته نمیشه.\n\n2- اگر مستاجر هستید بهتره که بدونین، اخیراً بانک مرکزی در دستورالعملی ابلاغ کرده که شرط دریافت، دست چک، ثبت اطلاعات افراد در سامانه املاک و اسکان هست و اگر مستاجر باشید عملاً باید کد رهگیری داشته باشید.\n\n3- برای دریافت وام رهن و اجاره، دریافت کد رهگیری الزامی است.\n\n4- برای ثبت نام دانش آموزان در مدارس، به خصوص مدارس دولتی، دریافت کد رهگیری الزامی است.',
  },

  {
    label: 'املاین چه خدماتی داره؟',
    answer:
      '1- کمتر از 7 دقیقه قرارداد رهن و اجاره بنویس.\n2- کمیسیون قانونی املاک رو محاسبه کن.\n3- آنلاین کد رهگیری قرارداد اجاره رو دریافت کن.\n4- بدون مراجعه به بانک، پول رهن و اجاره رو جا به جا کن.\n5- املاین، پرداخت به موقع اجاره مستاجرت رو تضمین می‌کنه.',
  },
]

const KENAR_DIVAR_SLUG = process.env.NEXT_PUBLIC_KENAR_DIVAR_SLUG

export default function Divar() {
  const router = useRouter()
  const { isLoggedIn, setToken } = useAuthContext()
  const { setIsSupportModalOpen } = useGuideContext()

  const { mutate: loginWithCode, isPending: loginPending } = useDivarLogin()

  const postToken = router.query.post_token
  const redirectUrl = publicRuntimeConfig.BASE_URL + router.asPath.split('?')[0]
  const returnUrl = router.query.return_url || 'https://open-platform-redirect.divar.ir/completion'

  // ست کردن مقدار در localStorage هنگام ورود به صفحه
  useEffect(() => {
    localStorage.setItem('fromDivarPage', 'true')
  }, [])

  const handleOAuthRedirect = () => {
    const state = generateRandomString()
    sessionStorage.setItem('oauth_state', state)
    if (isLoggedIn) router.push('/contracts')
    else {
      const oauthUrl = `https://oauth.divar.ir/oauth2/auth?response_type=code&client_id=${KENAR_DIVAR_SLUG}&redirect_uri=${redirectUrl}&scope=USER_PHONE&state=${state}`
      window.location.href = oauthUrl
    }
  }

  useEffect(() => {
    const { state, code } = router.query
    const storedState = sessionStorage.getItem('oauth_state')

    if (state) {
      if (storedState !== state || !code) {
        console.error('Error Redirect Reason:', storedState !== state ? 'Invalid State' : 'No Code')
        router.replace('/landing/divar/error')
        return
      }

      if (!isLoggedIn)
        loginWithCode(
          { code, redirect_url: redirectUrl },
          {
            onSuccess: (res) => {
              setToken({
                accessToken: res.data.access_token,
                refreshToken: res.data.refresh_token,
              })
              router.push('/contracts/new')
            },
            onError: (error) => {
              console.error('Login failed:', error)
              router.replace('/landing/divar/error')
            },
          }
        )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const methods = useForm({
    defaultValues: {
      security_deposit_amount: '',
      rent_amount: '',
    },
  })

  const [commissionData, setCommissionData] = useState(null)

  const { data: divarRentalCommissionData, isLoading } = useDivarRentalCommission(postToken)
  const { mutate: rentalCommissionMutation, isPending: rentalCommissionLoading } =
    useRentalCommission()

  const onSubmitCommission = (data) => {
    const submissionData = {
      security_deposit_amount: Number(data.security_deposit_amount),
      rent_amount: Number(data.rent_amount),
    }

    rentalCommissionMutation(submissionData, {
      onSuccess: (_data) => setCommissionData(_data.data),
      onError: handleErrorOnSubmit,
    })
  }

  useEffect(() => {
    if (divarRentalCommissionData && !isLoading) {
      const { deposit_amount: depositAmount, rent_amount: rentAmount } = divarRentalCommissionData

      methods.setValue('security_deposit_amount', depositAmount)
      methods.setValue('rent_amount', rentAmount)

      setCommissionData({
        commission: divarRentalCommissionData.commission.commission,
        tax: divarRentalCommissionData.commission.tax,
        total: divarRentalCommissionData.commission.total,
      })
    }
  }, [methods, divarRentalCommissionData, isLoading])

  return (
    <>
      <div className="py-4 sm:py-5 bg-slate-100 border-b border-neutral-200 flex flex-col items-center gap-2">
        <div className="relative w-[78px] sm:w-[98px] h-[32px] sm:h-[40px]">
          <Image
            priority
            fetchPriority="high"
            className="object-contain"
            src="/images/logotype.svg"
            alt="logo"
            fill
          />
        </div>
        <div className="text-primary text-xs sm:text-base font-semibold">
          سامانه انعقاد قرارداد آنلاین اجاره
        </div>
      </div>

      <div className="px-7 mt-7 sm:mt-10">
        <div className="p-4 sm:p-6 pt-6 sm:pt-9 bg-white rounded-2xl border border-gray-100 space-y-7 sm:space-y-12">
          <p className="text-[#0A0C0D] text-center text-sm sm:text-lg">
            هرجا که هستی، در هر ساعتی از شبانه روز،
            <br /> با خیال راحت <span className="text-primary font-bold">
              قرارداد اجاره
            </span> بنویس! <br /> و <span className="text-primary font-bold">کد رهگیری</span> رو
            رایگان بگیر!
          </p>

          <div className="relative w-[164px] sm:w-[220px] h-[120px] sm:h-[160px] mx-auto">
            <Image
              fill
              priority
              fetchPriority="high"
              alt="قرارداد آنلاین"
              src={onlineContract.src}
              className="object-contain"
            />
          </div>

          <div className="text-primary sm:text-xl text-center font-bold">
            مراحل انعقاد قرارداد ملک در املاین
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="relative space-y-3 isolate">
              <div className="h-[200px] w-0 absolute top-4 right-[13px] sm:right-[15px] border border-dashed border-orange-800 -z-10" />

              {contractSteps.map((step) => (
                <div className="flex items-center gap-3.5" key={step.number}>
                  <div className="size-[28px] sm:size-[32px] p-[2px] justify-center rounded-full border border-orange-800 bg-white">
                    <div className="size-full text-xs sm:text-sm text-orange-800 flex items-center justify-center bg-red-200 rounded-full sm:pl-px sm:pt-px fa">
                      {step.number}
                    </div>
                  </div>
                  <p className="text-[#0A0C0D] text-sm sm:text-base">{step.text}</p>
                </div>
              ))}

              <div />
            </div>

            <Button
              className="w-full"
              size="sm"
              onClick={handleOAuthRedirect}
              loading={loginPending}
            >
              شروع قرارداد
            </Button>

            <div className="p-2 sm:p-3.5 bg-[#F7F8F8] text-[#7D7E84] rounded flex items-start gap-1">
              <InfoIcon size={20} className="shrink-0" />
              <div className="text-xs sm:text-base">
                املاین برای شروع فرایند به شماره تلفن شما نیاز داره. این شماره فقط برای ثبت قرارداد
                استفاده می‌شه و به‌هیچ‌وجه در اختیار شخص دیگری قرار نمی‌گیره.
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                className="font-bold border-primary decoration-transparent border-b-2 border-dashed rounded-none px-0 h-7 "
                size="sm"
                variant="link"
                href={returnUrl}
              >
                بازگشت به دیوار
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-7 py-6 sm:py-9 mt-7 sm:mt-10 bg-red-800 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.10)] space-y-4 sm:space-y-6">
        <h3 className="text-white sm:text-xl font-bold text-center">کد تخفیف ویژه کاربران دیوار</h3>

        <p className="text-white text-center text-sm sm:text-base">
          هزینه انعقاد قرارداد در املاین بر اساس کمیسیون مصوب اتحادیه املاک و طبق ارزش ملک محاسبه
          می‌شه، اما درصورت استفاده از کد تخفیف زیر،‌ شما می‌تونید رایگان قرارداد بنویسید:
        </p>

        <div className="flex justify-between items-center px-4 sm:px-6 py-2 sm:py-3 bg-white rounded-sm">
          <button
            type="button"
            className="flex items-center gap-1 text-red-800 text-sm sm:text-base"
            onClick={() => {
              navigator.clipboard.writeText('DIVAR-lTruRjR')
              toast.success('کد تخفیف با موفقیت کپی شد.')
            }}
          >
            <CopyIcon size={20} />
            کپی کردن
          </button>

          <p className="text-[#7D7E84] text-sm sm:text-base leading-none sm:leading-tight">
            DIVAR-lTruRjR
          </p>
        </div>
      </div>

      <div className="px-7 mt-7 sm:mt-10">
        <div className="p-4 sm:p-6 pt-6 sm:pt-9 bg-white rounded-2xl border border-gray-100 space-y-7 sm:space-y-9">
          <h2 className="text-primary sm:text-xl text-center font-bold">
            کمیسیون واقعی معامله‌ت چقدره؟
          </h2>

          <p className="w-full max-w-lg mx-auto text-center text-[#0A0C0D] text-sm sm:text-lg">
            اگه میخوای بدونی به‌صورت قانونی چقدر باید پرداخت کنی، اینجا محاسبه‌ش کن:
          </p>

          <Form methods={methods} onSubmit={onSubmitCommission}>
            <div className="flex items-start gap-4">
              <InputNumberField
                name="security_deposit_amount"
                label="مبلغ ودیعه‌ (رهن)"
                placeholder="مبلغ ودیعه"
                suffix={<TomanIcon />}
                className="flex-1"
              />
              <InputNumberField
                name="rent_amount"
                label="مبلغ اجاره"
                placeholder="مبلغ اجاره"
                suffix={<TomanIcon />}
                className="flex-1"
              />
            </div>

            <Button
              size="sm"
              type="submit"
              variant="outline"
              className="w-full"
              loading={rentalCommissionLoading}
            >
              محاسبه کمیسیون
            </Button>
          </Form>

          <div className="space-y-4 sm:space-y-7">
            {commissionData && (
              <div className="px-6 py-5 bg-[#F7F8F8] rounded-lg space-y-2">
                <div className="flex items-center text-sm sm:text-base justify-between">
                  <p>کمیسیون هر یک از طرفین قرارداد</p>
                  <div className="flex items-center gap-1 fa">
                    {numberSeparator(commissionData.commission)}
                    <TomanIcon className="text-[#62636A]" size={20} />
                  </div>
                </div>

                <div className="flex items-center text-sm sm:text-base justify-between">
                  <p>مالیات هر یک از طرفین قرارداد</p>
                  <div className="flex items-center gap-1 fa">
                    {numberSeparator(commissionData.tax)}
                    <TomanIcon className="text-[#62636A]" size={20} />
                  </div>
                </div>

                <div className="w-full h-0 border-b border-[#E4E6E7]" />

                <div className="flex items-center text-sm sm:text-base justify-between">
                  <p>مجموع</p>
                  <div className="flex items-center gap-1 fa">
                    {numberSeparator(commissionData.total)}
                    <TomanIcon className="text-[#62636A]" size={20} />
                  </div>
                </div>
              </div>
            )}

            <div className="text-sm sm:text-lg text-[#0A0C0D] text-center">یا</div>

            <Button size="sm" className="w-full" onClick={handleOAuthRedirect}>
              با کد تخفیف قرارداد ببند!
            </Button>
          </div>
        </div>
      </div>

      <div className="px-7 mt-7 sm:mt-10">
        <div className="p-4 sm:p-6 pt-6 sm:pt-9 bg-white rounded-2xl border border-gray-100 space-y-4 sm:space-y-6">
          <h2 className="text-primary sm:text-xl text-center font-bold">خیالتون راحت!</h2>

          <p className="text-center text-[#0A0C0D] text-sm sm:text-lg sm:leading-relaxed">
            هر قراردادی که در املاین نوشته بشه، توسط گروهی از کارشناسان حقوقی متخصص بررسی و تایید
            می‌شه.
          </p>

          <div className="relative w-[130px] sm:w-[174px] h-[120px] sm:h-[160px] mx-auto">
            <Image alt="قرارداد آنلاین" src={secureContract.src} fill className="object-contain" />
          </div>

          <p className="text-center text-[#0A0C0D] text-sm sm:text-lg sm:leading-relaxed">
            املاین تحت نظارت سازمان نظام صنفی رایانه‌ای کشور و اتحادیه کسب و کارهای مجازی فعالیت
            می‌کنه و می‌تونید همه‌ی مجوزها و مدارک رسمی املاین رو در صفحه زیر ببینید:
          </p>

          <Button
            size="sm"
            variant="outline"
            className="w-full"
            href="https://amline.ir/licenses"
            target="_blank"
          >
            مشاهده مجوزها
          </Button>
        </div>
      </div>

      <div className="px-7 mt-7 sm:mt-10">
        <div className="p-4 sm:p-6 pt-6 sm:pt-9">
          <h3 className="text-primary sm:text-lg text-center font-bold">سوالات متداول</h3>

          <div className="flex flex-col gap-4 mt-5 py-4 fa">
            {questions.map((question, index) => (
              <Fragment key={question.label}>
                <CollapseBox label={question.label} contentClassName="pt-4">
                  <div className="whitespace-pre-wrap">{question.answer}</div>
                </CollapseBox>

                {index !== questions.length - 1 && (
                  <div className="w-full h-0 border-b border-[#F0F1F1]" />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm sm:text-base max-sm:max-w-96 text-center">
          اگر جوابت رو پیدا نکردی میتونی با کارشناسان املاین ارتباط بگیری تا اونا کمکت کنن.
        </p>

        <Button
          size="sm"
          variant="ghost"
          className="font-bold text-primary"
          onClick={() => setIsSupportModalOpen(true)}
        >
          <SupportIcon className="ml-1" />
          ارتباط با پشتیبانی
        </Button>
      </div>

      <Footer className="-mb-8" infoClassName="from-white" hideTrust={false} hideSiteLink hideNav />
    </>
  )
}

export function DivarError() {
  return (
    <>
      <div className="flex items-center justify-center px-7 py-3 bg-white border-b border-[#E1E1E1] gap-1">
        <Link href="/">
          <Image alt="logo" src="/images/logotype.svg" width={83} height={32} />
        </Link>
      </div>

      <div className="w-full flex flex-col items-center justify-center flex-grow px-[30px]">
        <div className="pl-14">
          <Image src={errorWarning.src} width={244} height={188} priority alt="error" />
        </div>
        <h3 className="text-lg font-medium mt-7">متاسفانه اطلاعات شما از دیوار دریافت نشد!</h3>
      </div>

      <div className="bg-white px-7 py-5 -mb-8">
        <Button className="w-full" href="https://open-platform-redirect.divar.ir/completion">
          بازگشت به دیوار
        </Button>
      </div>
    </>
  )
}
