import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

/**
 * get supabase token
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useSupabaseToken = (accessToken, options = {}) => {
  return useQuery({
    queryKey: ['supabase-token'],
    queryFn: () => axios.post('/api/token', { accessToken }),
    enabled: !!accessToken,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
    ...options,
  })
}

export default useSupabaseToken
