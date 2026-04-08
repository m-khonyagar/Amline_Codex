import { useEffect, useState } from 'react'
import { useAuthContext } from '..'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthSimpleLogin from '../components/AuthSimpleLogin'
import AuthPasswordLogin from '../components/AuthPasswordLogin'
import AuthLoginSwitcher from '../components/AuthLoginSwitcher'
import { ChevronRight } from 'lucide-react'

function LoginPage() {
  const { isLoggedIn } = useAuthContext()
  const navigate = useNavigate()
  const [isOtpLogin, setIsOtpLogin] = useState(true)
  const [searchParams] = useSearchParams()
  const title = searchParams.get('title')
  const showBackButton = title === 'backurl'
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [navigate, isLoggedIn])

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      {showBackButton && (
        <div className="absolute top-0 left-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-2 flex items-center gap-2 text-sm">
          <a href="https://app.amline.ir/">
            {' '}
            <ChevronRight className="size-5" />
          </a>
          <a href="https://app.amline.ir/">بازگشت به برنامک املاین</a>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg w-full max-w-lg">
        <img src="/images/logotype.svg" alt="logo" className="mx-auto mb-3" />
        <h1 className="text-center font-bold">ورود به&nbsp;{import.meta.env.VITE_APP_TITLE}</h1>

        <div className="mt-6">{isOtpLogin ? <AuthSimpleLogin /> : <AuthPasswordLogin />}</div>
        <AuthLoginSwitcher useOtpLogin={[isOtpLogin, setIsOtpLogin]} />

        <div className="text-center ">
          حساب کاربری ندارید؟&nbsp;
          <a
            href="https://app.amline.ir/auth/realtor"
            className=" mt-4 text-primary hover:underline"
          >
            ثبت نام
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
