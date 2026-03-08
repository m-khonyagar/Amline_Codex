import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Script from 'next/script'
import useStorage from '@/hooks/use-storage'
import useEitaa from '../hooks/use-eitaa'

function EitaaWebApp() {
  const router = useRouter()
  const [isEitaa, setIsEitaa] = useStorage('isEitaa', false, 'sessionStorage')
  const [isEitaaLoaded, setIsEitaaLoaded] = useState(false)
  const cameFromOutsideHome = useRef(null)
  const hasAttemptedLogin = useRef(false)
  const { loginWithEitaaUserId, isWebAppReady } = useEitaa()

  const handleScriptLoad = () => setIsEitaaLoaded(true)
  const handleScriptError = () => console.error('Failed to load Eitaa WebApp script')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash.indexOf('#tgWebAppData') > -1) setIsEitaa(true)
    if (window.history.length === 1 && router.pathname !== '/')
      cameFromOutsideHome.current = router.pathname
  }, [router.pathname, setIsEitaa])

  useEffect(() => {
    if (!isEitaa || !isEitaaLoaded) return () => {}
    const { BackButton } = window.Eitaa.WebApp

    BackButton.show()
    const nav = () => {
      if (router.pathname === cameFromOutsideHome.current) {
        router.push('/')
        cameFromOutsideHome.current = null
      } else router.back()
    }
    BackButton.onClick(nav)

    if (router.pathname === '/') BackButton.hide()

    return () => {
      if (window.Eitaa?.WebApp?.BackButton) BackButton.offClick(nav)
    }
  }, [isEitaa, isEitaaLoaded, router])

  useEffect(() => {
    if (!hasAttemptedLogin.current && isEitaaLoaded && isWebAppReady) {
      hasAttemptedLogin.current = true
      loginWithEitaaUserId()
      window.Eitaa?.WebApp?.disableVerticalSwipes()
    }
  }, [isEitaaLoaded, isWebAppReady, loginWithEitaaUserId])

  return isEitaa ? (
    <Script
      id="eitaa-web-app"
      strategy="afterInteractive"
      src="https://developer.eitaa.com/eitaa-web-app.js"
      onLoad={handleScriptLoad}
      onError={handleScriptError}
    />
  ) : null
}

export default EitaaWebApp
