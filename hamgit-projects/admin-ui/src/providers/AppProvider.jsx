import { getUA } from '@/utils/ua'
import { Outlet } from 'react-router-dom'
// import Toaster from '@/components/Toaster'
import { AuthProvider } from '@/features/auth'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createContext, Suspense, useContext, useMemo } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import Toaster from '@/components/ui/Toaster'

// function ErrorFallback() {
//   return (
//     <div role="alert">
//       <h2>Ooops, something went wrong :( </h2>
//       <button onClick={() => window.location.assign(window.location.origin)}>Refresh</button>
//     </div>
//   )
// }

const QueryClientDefaultOptions = {
  queries: {
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  },
}

const AppContext = createContext()

const useAppContext = () => {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error('useAppContext was used outside of its Provider')
  }

  return context
}

function AppProvider() {
  const queryClient = new QueryClient({ defaultOptions: QueryClientDefaultOptions })
  const ua = getUA(window.navigator.userAgent)

  const values = useMemo(
    () => ({
      ua,
      isPc: ua.isPc,
      isTablet: ua.isTablet,
      isMobile: ua.isMobile,
    }),
    [ua]
  )

  return (
    <Suspense fallback={<div>loading...</div>}>
      <QueryClientProvider client={queryClient}>
        <AppContext.Provider value={values}>
          <Toaster />

          {/* <ErrorBoundary FallbackComponent={ErrorFallback}> */}

          <AuthProvider>
            <Outlet />
          </AuthProvider>

          {/* </ErrorBoundary> */}
        </AppContext.Provider>
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
      </QueryClientProvider>
    </Suspense>
  )
}

export { useAppContext, AppProvider }
