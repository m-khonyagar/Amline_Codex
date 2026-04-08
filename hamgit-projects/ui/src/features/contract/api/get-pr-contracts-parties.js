import { useQuery } from '@tanstack/react-query'
import { apiGetPrContractsParties } from '@/data/api/contract'

const queryKey = ['pr-contracts-parties']

const generateGetPrContractPartiesQueryKey = (id) => {
  return queryKey.concat(Number(id))
}

/**
 * @param id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetPrContractsParties = (id, options = {}) => {
  return useQuery({
    queryKey: generateGetPrContractPartiesQueryKey(id),
    queryFn: () => apiGetPrContractsParties(id),
    select: (res) => res.data,
    ...options,
  })
}

export default useGetPrContractsParties
export { generateGetPrContractPartiesQueryKey }
