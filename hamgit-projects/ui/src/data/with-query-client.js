import { QueryClient, dehydrate } from '@tanstack/react-query'
import { isServerSide } from '@/utils/environment'

let queryClient
const isServer = isServerSide()

const defaultOptions = {
  queries: {
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    cacheTime: isServer ? 1000 : 5 * 60 * 1000,
  },
}

function getQueryClient() {
  if (queryClient && !isServer) return queryClient
  if (!isServer) {
    queryClient = new QueryClient({
      defaultOptions,
    })

    return queryClient
  }

  return new QueryClient({
    defaultOptions,
  })
}

/**
 * @param {getPropsCallback} fn
 * @returns {}
 * warning: in one page only once use withQueryClient to prevent two instance of query client
 */
const withQueryClient = (fn) => {
  const _queryClient = getQueryClient()

  return async (ctx) => {
    const props = await fn(ctx, _queryClient)

    return {
      ...(props || {}),
      dehydratedState: dehydrate(_queryClient),
    }
  }
}

export { withQueryClient, getQueryClient }

/**
 * callback function can be use in getInitialProps
 * @callback getPropsCallback
 * @param {import('next/types').NextPageContext} ctx
 * @param {import('@tanstack/react-query').QueryClient} queryClient
 */
