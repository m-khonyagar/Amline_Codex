import { UAParser } from 'ua-parser-js'
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useIsomorphicEffect } from '@/hooks/use-isomorphic-effect'
import useSettings from '@/utils/use-settings'

/**
 * @typedef TAppContext
 * @property {object} ua
 * @property {string} deviceId
 * @property {function} toggleBottomNavigation
 */

/** @type {import('react').Context<TAppContext>} */
const AppContext = createContext()

const useAppContext = () => {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error('useAppContext was used outside of its Provider')
  }

  return context
}

function AppProvider({ children, initialUserAgent }) {
  const ua = useRef(new UAParser(initialUserAgent).getResult())

  const toggleBottomNavigation = (show) => {
    const _show = show !== undefined ? show : !document.body.hasAttribute('hide-bottom-navigation')

    if (_show) {
      document.body.removeAttribute('hide-bottom-navigation')
    } else {
      document.body.setAttribute('hide-bottom-navigation', '')
    }
  }

  useIsomorphicEffect(() => {
    if (!initialUserAgent) {
      ua.current = new UAParser(window.navigator.userAgent).getResult()
    }
  }, [initialUserAgent])

  const [defaultCities, setDefaultCities] = useSettings('default_city', {
    province: '',
    city_name: '',
    cities: [],
  })
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const allowedRoutes = ['/ads/[type]', '/ads/[type]/[cat]', '/requirements']

    if (
      defaultCities !== undefined &&
      !defaultCities?.province &&
      allowedRoutes.includes(router.route)
    ) {
      setIsOpen(true)
    }
  }, [defaultCities, router])

  const values = useMemo(
    () => ({
      ua: ua.current,
      toggleBottomNavigation,
      defaultCities,
      setDefaultCities,
      isOpen,
      setIsOpen,
    }),
    [defaultCities, isOpen, setDefaultCities]
  )

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>
}

export { useAppContext, AppProvider }
