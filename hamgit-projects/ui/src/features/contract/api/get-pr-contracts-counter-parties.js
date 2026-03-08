import { useQuery } from '@tanstack/react-query'
import { apiGetPrContractsCounterParties } from '@/data/api/contract'

const queryKey = ['pr-contracts-counter-parties']

const generateGetPrContractCounterPartiesQueryKey = (id) => {
  return queryKey.concat(Number(id))
}

/**
 * @param id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetPrContractsCounterParties = (id, options = {}) => {
  return useQuery({
    queryKey: generateGetPrContractCounterPartiesQueryKey(id),
    queryFn: () => apiGetPrContractsCounterParties(id),
    select: (res) => res.data,
    ...options,
  })
}

export default useGetPrContractsCounterParties
export { generateGetPrContractCounterPartiesQueryKey }
