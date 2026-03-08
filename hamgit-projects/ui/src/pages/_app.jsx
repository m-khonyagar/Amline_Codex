import '@/assets/styles/global.scss'
import 'leaflet/dist/leaflet.css'

import { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import SEO from '@/components/SEO'
import { ErrorPage, NoneLayout } from '@/features/app'
import Toaster from '@/components/ui/Toaster'
import { getQueryClient } from '@/data/with-query-client'
import publicRuntimeConfig from '@/configs/public-runtime-config.mjs'
import MicrosoftClarity from '@/components/MicrosoftClarity'
import GoftinoWidget from '@/components/GoftinoWidget'

export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => getQueryClient())

  const Layout = Component.layout || NoneLayout
  const layoutOptions = Component.layoutOptions || {}
  const router = useRouter()
  const fullUrl = `${publicRuntimeConfig.BASE_URL}${router.asPath === '/' ? '' : router.asPath}`

  return (
    <>
      <SEO
        openGraph={{
          image: '/images/logo-512-512.png',
          siteName: 'املاین',
          url: fullUrl,
          locale: 'fa_IR',
        }}
      >
        <meta charSet="UTF-8" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta
          name="google-site-verification"
          content="blnXI27XsGBqxG-pNhAUaU5GSDsYEUqjV2IssP_znGU"
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/images/logo-512-512.png" />
        <link rel="icon" sizes="512x512" href="/images/logo-512-512.png" />
      </SEO>

      <MicrosoftClarity />

      <GoftinoWidget />

      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps?.dehydratedState}>
          <Layout options={layoutOptions} {...pageProps}>
            <ErrorBoundary FallbackComponent={ErrorPage}>
              <Component {...pageProps} />
            </ErrorBoundary>
          </Layout>

          <Toaster
            withBottomOffset={!!layoutOptions.bottomNavigation || !!layoutOptions.bottomCTA}
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </HydrationBoundary>
      </QueryClientProvider>
    </>
  )
}
