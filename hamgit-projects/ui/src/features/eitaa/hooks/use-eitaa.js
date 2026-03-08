import { useCallback, useEffect, useState } from 'react'
import useStorage from '@/hooks/use-storage'
import { useAuthContext } from '@/features/auth'
import { useEitaaLogin, useEitaaLoginWithId } from '../api/eitaa-login'
import { toast } from '@/components/ui/Toaster'
import { parseEitaaData } from '@/utils/eitaa'

const useEitaa = () => {
  const [isEitaa] = useStorage('isEitaa', false, 'sessionStorage')
  const [isWebAppReady, setWebAppReady] = useState(false)
  const { setToken, removeUserData } = useAuthContext()
  const { mutate: eitaaLogin, isPending: isEitaaLoginPending } = useEitaaLogin()
  const { mutate: eitaaLoginWithId, isPending: isEitaaLoginWithIdPending } = useEitaaLoginWithId()

  const handleSuccess = useCallback(
    ({ data }) =>
      setToken({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      }),
    [setToken]
  )

  const handleLoginWithContact = useCallback(() => {
    const { requestContact } = window.Eitaa.WebApp

    requestContact((isAccepted, response) => {
      if (!isAccepted) {
        toast.error('برای ورود به سیستم باید اجازه دسترسی را دهید')
        removeUserData()
        return
      }

      eitaaLogin(response.response, {
        onSuccess: handleSuccess,
        onError: removeUserData,
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSuccess, removeUserData])

  const loginWithEitaaUserId = useCallback(() => {
    const { initData } = window.Eitaa.WebApp
    const parsedData = parseEitaaData(initData)
    const userId = parsedData?.user?.id

    if (!userId) {
      console.error('Eitaa login with ID failed: User ID not found')
      handleLoginWithContact()
      return
    }

    eitaaLoginWithId(String(userId), {
      onSuccess: handleSuccess,
      onError: (error) => {
        console.error('Eitaa login with ID failed:', error)
        removeUserData()
        handleLoginWithContact()
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleLoginWithContact, handleSuccess, removeUserData])

  useEffect(() => {
    let intervalId

    if (typeof window !== 'undefined') {
      if (window?.Eitaa?.WebApp) {
        setWebAppReady(true)
      } else {
        const start = Date.now()
        intervalId = setInterval(() => {
          if (window?.Eitaa?.WebApp) {
            clearInterval(intervalId)
            setWebAppReady(true)
          } else if (Date.now() - start > 5000) {
            clearInterval(intervalId)
          }
        }, 100)
      }
    }

    return () => clearInterval(intervalId)
  }, [])

  return {
    isEitaa,
    loginWithEitaa: handleLoginWithContact,
    loginWithEitaaUserId,
    isEitaaLoginPending: isEitaaLoginPending || isEitaaLoginWithIdPending,
    isWebAppReady,
  }
}

export default useEitaa
