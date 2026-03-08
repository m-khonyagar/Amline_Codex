import { useQuery } from '@tanstack/react-query'
import { apiGetRegions } from '@/data/api/city'

const useGetRegions = (id, options = {}) => {
  return useQuery({
    queryKey: ['regions', id],
    queryFn: () => apiGetRegions(id),
    select: (res) => res.data,
    ...options,
    _optimisticResults: 'optimistic',
  })
}

export default useGetRegions
