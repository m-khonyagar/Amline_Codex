import { createContext, useContext, useMemo, useState, useLayoutEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCurrentUser, useLogout } from '../data/api/user'
import {
  hasAccessToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '../utils/token'
import { useQueryClient } from '@tanstack/react-query'
import Button from '@/components/ui/Button'

/**
 * @typedef TAuthContext
 * @property {boolean} isLoggedIn
 * @property {boolean} initialLoading
 * @property {boolean} isLoadingCurrentUser
 * @property {number | null} userId - the user id
 * @property {function} setUserAndToken - set token and user id
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

function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [initialLoading, setInitialLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(!!hasAccessToken())
  const queryClient = useQueryClient()

  const location = useLocation()
  const requireAuth = location.pathname !== '/login'
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

  const setToken = ({ accessToken, refreshToken }) => {
    setAccessToken(accessToken)
    if (refreshToken) {
      setRefreshToken(refreshToken)
    }
  }

  const removeUserData = () => {
    removeAccessToken()
    removeRefreshToken()
    queryClient.clear()
    setIsLoggedIn(false)
  }

  const logoutMutation = useLogout({
    onSuccess: () => {
      removeUserData()
    },
    onError: () => {
      removeUserData()
    },
  })

  useLayoutEffect(() => {
    setInitialLoading(false)
  }, [])

  useLayoutEffect(() => {
    if (requireAuth && !initialLoading && !isLoadingCurrentUser && !isLoggedIn) {
      navigate(`/login`, { replace: true })
    }
  }, [navigate, requireAuth, initialLoading, isLoadingCurrentUser, isLoggedIn])

  const values = useMemo(
    () => ({
      isLoggedIn,
      initialLoading,
      logoutMutation,
      setToken,
      currentUserQuery,
      isLoadingCurrentUser,
      currentUser: currentUserQuery.data,
      setIsLoggedIn,
    }),
    [isLoggedIn, initialLoading, logoutMutation, currentUserQuery, isLoadingCurrentUser]
  )

  if (requireAuth && (initialLoading || !isLoggedIn)) {
    return <div className="min-h-screen flex items-center justify-center">loading</div>
  }

  if (requireAuth && currentUserQuery.isError) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center">
        خطایی رخ داد
        <Button size="sm" onClick={() => currentUserQuery.refetch()}>
          تلاش مجدد
        </Button>
      </div>
    )
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export { useAuthContext, AuthProvider }
