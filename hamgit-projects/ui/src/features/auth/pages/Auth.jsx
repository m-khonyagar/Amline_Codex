import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuthContext } from '@/features/auth'
import AuthForm from '../components/AuthForm'
import AuthFormSkeleton from '../components/AuthFormSkeleton'
import { useEitaa } from '@/features/eitaa'
import Button from '@/components/ui/Button'
import SEO from '@/components/SEO'

function AuthPage() {
  const { isLoggedIn, initialLoading, setToken, removeUserData } = useAuthContext()
  const { replace, query, isReady } = useRouter()

  const { isEitaa, isWebAppReady, loginWithEitaaUserId, loginWithEitaa, isEitaaLoginPending } =
    useEitaa()

  useEffect(() => {
    if (isEitaa && isWebAppReady) loginWithEitaaUserId()
  }, [isEitaa, isWebAppReady, loginWithEitaaUserId])

  useEffect(() => {
    if (query.tk) {
      removeUserData()
      setToken({
        accessToken: query.tk,
        options: {
          isAdmin: true,
        },
      })
    }

    if (isLoggedIn && isReady) {
      // Check if user came from Divar page
      const fromDivarPage =
        typeof window !== 'undefined' && localStorage.getItem('fromDivarPage') === 'true'
      if (fromDivarPage) {
        replace('/contracts')
        return
      }
      const redirectPath = query.prev || '/'
      replace(redirectPath)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, isReady, query])

  // eslint-disable-next-line no-nested-ternary
  return initialLoading ? (
    <AuthFormSkeleton />
  ) : isLoggedIn ? (
    <div className="my-auto text-center">خوش آمدید</div>
  ) : (
    <>
      <SEO title="ورود و ثبت‌نام" noIndex />
      <AuthForm />
      <div className="mx-6 mt-4 text-center">
        {isEitaa && (
          <Button
            variant="link"
            className="w-full"
            onClick={() => loginWithEitaa()}
            loading={isEitaaLoginPending}
          >
            ورود با ایتا
          </Button>
        )}
      </div>
    </>
  )
}

export default AuthPage
