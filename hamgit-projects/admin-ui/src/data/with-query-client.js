import { QueryClient, dehydrate } from '@tanstack/react-query'

let queryClient

const defaultOptions = {
  queries: {
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    cacheTime: 5 * 60 * 1000,
  },
}

function getQueryClient() {
  if (queryClient) return queryClient

  queryClient = new QueryClient({
    defaultOptions,
  })

  return queryClient
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
