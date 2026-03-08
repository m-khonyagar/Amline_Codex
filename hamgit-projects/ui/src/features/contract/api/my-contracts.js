/* eslint-disable no-unsafe-optional-chaining */
import { useQuery } from '@tanstack/react-query'
import { apiGetContracts } from '@/data/api/contract'

const myContractQueryKey = ['contracts-list']
/**
 * get user contracts
 * @param {import('@tanstack/react-query').UseInfiniteQueryOptions} options
 * @returns {import('@tanstack/react-query').UseInfiniteQueryResult}
 */
const useMyContracts = (options = {}) => {
  return useQuery({
    queryKey: myContractQueryKey,

    queryFn: apiGetContracts,

    select: (res) => res.data,

    ...options,
  })
}

export default useMyContracts

export { myContractQueryKey }
