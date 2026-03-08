import Head from 'next/head'
import { useEffect, useState } from 'react'
import { cn } from '@/utils/dom'
import { AuthProvider } from '@/features/auth'
import { AppProvider } from '../providers/AppProvider'
import BottomNavigation from '../components/BottomNavigation'
import LoggedInAsUserMenu from '../components/LoggedInAsUserMenu'
import DefaultCityPicker from '../components/DefaultCityPicker'
import { GuideDrawer, GuideProvider } from '@/features/guide'
import { ChatProvider } from '@/features/chat'
import { EitaaWebApp } from '@/features/eitaa'

export default function BaseLayout({ children, options = {} }) {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false)
  const [fromDivarPage, setFromDivarPage] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFromDivarPage(localStorage.getItem('fromDivarPage') === 'true')
    }
  }, [])

  useEffect(() => {
    const setWidget = () => {
      // eslint-disable-next-line no-undef
      Goftino?.setWidget({ marginRight: 20, hasSound: true })
    }

    const handleOpen = () => setIsWidgetOpen(true)
    const handleClose = () => setIsWidgetOpen(false)

    window.addEventListener('goftino_openWidget', () => handleOpen())
    window.addEventListener('goftino_closeWidget', () => handleClose())
    window.addEventListener('goftino_ready', setWidget)

    return () => {
      window.removeEventListener('goftino_ready', setWidget)
      window.removeEventListener('goftino_openWidget', handleOpen)
      window.removeEventListener('goftino_closeWidget', handleClose)
    }
  }, [])

  return (
    <AppProvider>
      <GuideProvider>
        <AuthProvider requireAuth={options.requireAuth}>
          <EitaaWebApp />
          <ChatProvider>
            {!isWidgetOpen && (
              <Head>
                <style>
                  {`
                  #goftino_w {
                    bottom: ${options.bottomNavigation || options.bottomCTA ? '75px' : '30px'} !important;
                  }
                  `}
                </style>
              </Head>
            )}

            <main
              id="__main"
              className={cn(
                `max-w-2xl min-h-screen mx-auto flex flex-col shadow ${options.bgWhite === true ? 'bg-white' : ' bg-[#F4F9F9]'} `,
                options.bottomNavigation === true || options.bottomCTA === true ? 'pb-28' : 'pb-8'
              )}
            >
              {children}
            </main>

            {options.bottomNavigation === true && !fromDivarPage && (
              <div className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-2xl w-full z-50">
                <BottomNavigation />
              </div>
            )}

            <LoggedInAsUserMenu />

            <DefaultCityPicker />

            <GuideDrawer />
          </ChatProvider>
        </AuthProvider>
      </GuideProvider>
    </AppProvider>
  )
}
