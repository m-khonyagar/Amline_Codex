import { useQuery } from '@tanstack/react-query'
import { apiGetPrContractsPartiesTenant } from '@/data/api/contract'

const queryKey = ['pr-contracts-parties-tenant']

const generateGetPrContractPartiesTenantQueryKey = (id) => {
  return queryKey.concat(Number(id))
}

/**
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetPrContractsPartiesTenant = (id, options = {}) => {
  return useQuery({
    queryKey: generateGetPrContractPartiesTenantQueryKey(id),
    queryFn: () => apiGetPrContractsPartiesTenant(id),
    select: (res) => res.data,
    ...options,
  })
}

export default useGetPrContractsPartiesTenant
export { generateGetPrContractPartiesTenantQueryKey }
