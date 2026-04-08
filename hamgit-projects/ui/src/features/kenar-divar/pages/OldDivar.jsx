import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import publicRuntimeConfig from '@/configs/public-runtime-config.mjs'
import { Benefit, Footer, TrustItems } from '@/features/home'
import { generateRandomString } from '@/utils/string'
import useDivarLogin from '../api/divar-login-oauth'
import { useAuthContext } from '@/features/auth'
import calculatorStatisticsImage from '@/assets/images/landing/calculator-statistics.png'
import contractImage from '@/assets/images/landing/contract.png'
import errorWarning from '@/assets/images/landing/error-warning.png'
import loadingTwoTone from '@/assets/images/line-loading-twotone.svg'

const KENAR_DIVAR_SLUG = process.env.NEXT_PUBLIC_KENAR_DIAVR_SLUG || 'lake-hollow-braid'

export default function Divar() {
  const router = useRouter()
  const { isLoggedIn, setToken } = useAuthContext()

  const { mutate: loginWithCode, isPending: loginPending } = useDivarLogin()

  const postToken = router.query.post_token
  const redirectUrl = publicRuntimeConfig.BASE_URL + router.asPath.split('?')[0]
  const returnUrl = router.query.return_url || 'https://open-platform-redirect.divar.ir/completion'

  const handleOAuthRedirect = () => {
    const state = generateRandomString()
    sessionStorage.setItem('oauth_state', state)

    if (isLoggedIn) router.push('/contracts?source=divar')
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
              router.push('/contracts?source=divar')
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

  return (
    <>
      <div className="flex items-center justify-between px-7 py-6 bg-white border-b border-[#E1E1E1] gap-1">
        <Link href="/">
          <Image alt="logo" src="/images/logotype.svg" width={83} height={32} />
        </Link>

        <Button size="sm" variant="outline" href={returnUrl}>
          بازگشت به دیوار
        </Button>
      </div>

      <div className="p-7">
        {loginPending ? (
          <div className="flex flex-col justify-center items-center h-[420px]">
            <Image
              src={loadingTwoTone.src}
              width={76}
              height={76}
              alt="loading"
              className="animate-spin"
            />
            <p className="font-medium mt-5">در حال دریافت اطلاعات شما از دیوار...</p>
          </div>
        ) : (
          <>
            <div className="bg-white p-5 rounded-2xl">
              <h2 className="text-lg font-medium leading-8 text-center mb-3.5">
                بیمه قرارداد اجاره
              </h2>
              <p className="text-sm">
                در املاین میتونی قرارداد اجاره رو <strong>بیمه</strong> کنی، اینطوری که اگر مستاجر
                اجاره‌بها ماهیانه رو پرداخت نکنه، خیالت راحته که{' '}
                <strong>املاین پرداخت میکنه!</strong>
              </p>
              <p className="text-sm">فقط کافیه در سایت املاین قراردادت رو بنویسی.</p>
            </div>

            <div className="flex flex-col items-center gap-6 mt-8">
              <Image src={contractImage.src} width={104} height={195} priority alt="contract" />

              <div className="bg-white p-5 rounded-2xl">
                <p className="text-sm">
                  برای اینکه بتونیم برای شما قرارداد ببندیم و بهتون خدمات ارائه بدیم، نیاز داریم که
                  شماره شما رو از دیوار بگیریم و در سایت ثبت نام کنیم. لطفاً دکمه زیر رو بزنید تا به
                  ما اجازه دسترسی بدید.
                </p>
              </div>

              <Button className="w-full" onClick={handleOAuthRedirect}>
                ثبت نام و شروع انعقاد قرارداد
              </Button>
            </div>
          </>
        )}

        <div className="mt-12">
          <h3 className="text-lg font-bold mb-7 text-center">
            میخوای بدونی کمیسیون قراردادت چقدره؟
          </h3>

          <div className="bg-white px-5 py-2 rounded-2xl flex items-center justify-between">
            <Image
              src={calculatorStatisticsImage.src}
              width={124}
              height={99}
              alt="calculate commission"
            />

            <div className="flex flex-col items-center gap-2">
              <p>برای محاسبه کمیسیون</p>
              <Link
                href={
                  postToken
                    ? `/commission/calculate?post_token=${postToken}`
                    : '/commission/calculate'
                }
                className="bg-[#376C5B] rounded-2xl text-white text-sm font-bold px-5 py-1"
              >
                کلیک کنید
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <h3 className="text-lg font-bold mb-7 text-center">املاین چه فرقی میکنه؟</h3>
          <Benefit />
        </div>

        <TrustItems className="mt-14 mb-7" />
      </div>

      <Footer className="-mb-8" hideNav hideSiteLink />
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
