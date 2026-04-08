import { useQuery } from '@tanstack/react-query'
import { apiGetAd } from '@/data/api/ad'

const adQueryKey = ['ad']

const generateGetAdQueryKey = (id) => {
  return adQueryKey.concat(Number(id))
}

/**
 * get ad by id query
 * @param {number | string} id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetAd = (id, options = {}) => {
  return useQuery({
    queryKey: generateGetAdQueryKey(id),
    queryFn: () => apiGetAd(id),
    select: (res) => res.data,
    ...options,
  })
}

export default useGetAd

export { generateGetAdQueryKey }
