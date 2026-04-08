import { useQuery } from '@tanstack/react-query'
import { apiGetPrContractPreview } from '@/data/api/contract'

const generateGetPrContractPreviewQueryKey = (id) => {
  return ['pr-contract-preview'].concat(Number(id))
}

/**
 * get pr-contract preview by id
 * @param id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetPrContractPreview = (id, options = {}) => {
  return useQuery({
    queryKey: generateGetPrContractPreviewQueryKey(id),
    queryFn: () => apiGetPrContractPreview(id),
    select: (res) => res.data,
    ...options,
  })
}

export default useGetPrContractPreview
export { generateGetPrContractPreviewQueryKey }
