import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import useIsMounted from './use-is-mounted'

const useBack = () => {
  const router = useRouter()
  const routeChanged = useRef(false)
  const isMounted = useIsMounted()

  const goBack = (backUrl, backCount = 1) => {
    if (backCount === 1) {
      router.back()
    } else {
      window.history.go(-1 * backCount)
    }

    setTimeout(() => {
      if (!routeChanged.current) {
        if (backUrl) {
          router.replace(backUrl)
          if (isMounted()) routeChanged.current = false
        } else {
          router.push('/')
          console.warn('please provide back path')
        }
      }
    }, 100)
  }

  useEffect(() => {
    const handlePopState = () => {
      routeChanged.current = true
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  })

  return { goBack }
}

export default useBack
