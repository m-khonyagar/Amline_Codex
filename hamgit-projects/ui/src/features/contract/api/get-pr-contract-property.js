import { useQuery } from '@tanstack/react-query'
import { apiGetPrContractProperty } from '@/data/api/contract'

const queryKey = ['contract-property']

const generateGetPrContractPropertyQueryKey = (id) => {
  return queryKey.concat(Number(id))
}

/**
 * get pr contract property by id query
 * @param id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetPrContractProperty = (id, options = {}) => {
  return useQuery({
    queryKey: generateGetPrContractPropertyQueryKey(id),
    queryFn: () => apiGetPrContractProperty(id),
    select: (res) => res.data,
    ...options,
  })
}

export default useGetPrContractProperty
export { generateGetPrContractPropertyQueryKey }
