import { useQuery } from '@tanstack/react-query'
import { apiGetPrContractsPartiesLandlord } from '@/data/api/contract'

const queryKey = ['pr-contracts-parties-landlord']

const generateGetPrContractPartiesLandlordQueryKey = (id) => {
  return queryKey.concat(Number(id))
}

/**
 * @param id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetPrContractsPartiesLandlord = (id, options = {}) => {
  return useQuery({
    queryKey: generateGetPrContractPartiesLandlordQueryKey(id),
    queryFn: () => apiGetPrContractsPartiesLandlord(id),
    select: (res) => res.data,
    ...options,
  })
}

export default useGetPrContractsPartiesLandlord
export { generateGetPrContractPartiesLandlordQueryKey }
