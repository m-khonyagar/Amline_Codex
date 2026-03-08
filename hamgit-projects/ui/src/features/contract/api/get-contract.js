import { useQuery } from '@tanstack/react-query'
import { apiGetContract } from '@/data/api/contract'

const contractQueryKey = ['contract']

const generateGetContractQueryKey = (id) => {
  return contractQueryKey.concat(Number(id))
}

/**
 * get contract by id query
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetContract = (id, options = {}) => {
  return useQuery({
    queryKey: generateGetContractQueryKey(id),
    queryFn: () => apiGetContract(id),
    select: (res) => res.data,
    ...options,
  })
}

export default useGetContract
export { generateGetContractQueryKey }
