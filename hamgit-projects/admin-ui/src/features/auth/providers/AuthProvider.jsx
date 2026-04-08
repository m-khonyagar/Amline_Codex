import { createContext, useContext, useLayoutEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import useAdminLogout from '../api/logout'
import { useCurrentUser } from '../api/get-current-user'
import {
  hasAccessToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/utils/token'

/**
 * @typedef TAuthContext
 * @property {boolean} isLoggedIn
 * @property {boolean} initialLoading
 * @property {boolean} isLoadingCurrentUser
 * @property {number | null} userId - the user id
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

function AuthProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const [initialLoading, setInitialLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(!!hasAccessToken())
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

  const logoutMutation = useAdminLogout({
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
      navigate('/login', { replace: true })
    }
  }, [requireAuth, initialLoading, isLoadingCurrentUser, isLoggedIn, navigate])

  const values = useMemo(
    () => ({
      isLoggedIn,
      initialLoading,
      logoutMutation,
      setToken,
      isLoadingCurrentUser,
      currentUser: currentUserQuery.data,
      setIsLoggedIn,
    }),
    [isLoggedIn, initialLoading, logoutMutation, currentUserQuery, isLoadingCurrentUser]
  )
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { useAuthContext, AuthProvider }
