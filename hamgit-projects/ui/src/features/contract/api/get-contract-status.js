import { useQuery } from '@tanstack/react-query'
import { apiGetPrContractStatus } from '@/data/api/contract'

const generateGetContractStatusQueryKey = (id) => {
  return ['contract-status'].concat(Number(id))
}

/**
 * get contract status by id
 * @param id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetContractStatus = (id, options = {}) => {
  return useQuery({
    queryKey: generateGetContractStatusQueryKey(id),
    queryFn: () => apiGetPrContractStatus(id),
    select: (res) => res.data,
    ...options,
  })
}

export default useGetContractStatus
export { generateGetContractStatusQueryKey }
