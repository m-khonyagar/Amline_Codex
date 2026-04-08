import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import useLogout from '../api/logout'
import useCurrentUser from '../api/get-current-user'
import {
  hasAccessToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '../utils/token'
import { useIsomorphicEffect } from '@/hooks/use-isomorphic-effect'
import { CircleLoadingIcon } from '@/components/icons'
import Button from '@/components/ui/Button'
import useLocalStorage from '@/hooks/useLocalStorage'
import bc from '@/utils/broadcast-channel'

/**
 * @typedef TAuthContext
 * @property {boolean} isLoggedIn
 * @property {boolean} initialLoading
 * @property {boolean} isLoadingCurrentUser
 * @property {function} setToken - set token
 * @property {object | null} currentUser - the current user object
 * @property {import('@tanstack/react-query').UseQueryResult} currentUserQuery
 * @property {import('@tanstack/react-query').UseMutationResult} logoutMutation
 */

/** @type {import('react').Context<TAuthContext>} */
const AuthContext = createContext({})

const useAuthContext = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuthContext was used outside of its Provider')
  }

  return context
}

function AuthProvider({ children, requireAuth }) {
  const router = useRouter()
  const [initialLoading, setInitialLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(!!hasAccessToken())
  const [loggedInAsUser, setLoggedInAsUser] = useLocalStorage(
    process.env.NEXT_PUBLIC_LOGIN_AS_USER_KEY,
    false
  )
  const queryClient = useQueryClient()
  const currentUserQuery = useCurrentUser({
    enabled: isLoggedIn,
    onError: (e) => {
      console.error(e)
    },
  })

  const isLoadingCurrentUser = useMemo(
    () => isLoggedIn && currentUserQuery.isPending,
    [isLoggedIn, currentUserQuery.isPending]
  )

  const setToken = useCallback(
    ({ accessToken, refreshToken, options = {} }) => {
      setAccessToken(accessToken)
      if (refreshToken) {
        setRefreshToken(refreshToken)
      }
      setIsLoggedIn(true)
      setLoggedInAsUser(options?.isAdmin || false)
    },
    [setLoggedInAsUser]
  )

  const removeUserData = useCallback(() => {
    removeAccessToken()
    removeRefreshToken()
    queryClient.clear()
    setLoggedInAsUser(false)
    setIsLoggedIn(false)
    bc.postMessage('reload-page')
  }, [queryClient, setLoggedInAsUser])

  const logoutMutation = useLogout({
    onSuccess: () => {
      removeUserData()
    },
  })

  useIsomorphicEffect(() => {
    setInitialLoading(false)
  }, [])

  useIsomorphicEffect(() => {
    if (requireAuth && !initialLoading && !isLoadingCurrentUser && !isLoggedIn && router.isReady) {
      router.replace(`/auth?prev=${router.query.prev || encodeURIComponent(router.asPath)}`)
    }
  }, [requireAuth, initialLoading, isLoadingCurrentUser, isLoggedIn, router.isReady])

  useEffect(() => {
    window.addEventListener('goftino_ready', () => {
      // eslint-disable-next-line no-undef
      Goftino?.setUser({
        email: currentUserQuery?.data?.email,
        name: currentUserQuery?.data?.name,
        phone: currentUserQuery?.data?.mobile,
        forceUpdate: false,
      })
    })
  }, [currentUserQuery.data])

  const values = useMemo(
    () => ({
      isLoggedIn,
      initialLoading,
      logoutMutation,
      setToken,
      currentUserQuery,
      isLoadingCurrentUser,
      currentUser: currentUserQuery.data,
      loggedInAsUser,
      removeUserData,
    }),
    [
      isLoggedIn,
      initialLoading,
      logoutMutation,
      setToken,
      currentUserQuery,
      isLoadingCurrentUser,
      loggedInAsUser,
      removeUserData,
    ]
  )

  if (requireAuth && (initialLoading || !isLoggedIn)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircleLoadingIcon size={42} className="animate-spin text-teal-600" />
      </div>
    )
  }

  if (requireAuth && currentUserQuery.isError) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center">
        خطایی رخ داد
        <Button variant="link" onClick={() => currentUserQuery.refetch()}>
          تلاش مجدد
        </Button>
      </div>
    )
  }
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { useAuthContext, AuthProvider }
