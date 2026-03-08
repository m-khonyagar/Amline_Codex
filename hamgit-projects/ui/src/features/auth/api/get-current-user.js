import { useQuery } from '@tanstack/react-query'
import { apiGetCurrentUser } from '@/data/api/user'
import { fullName } from '@/utils/dom'

const currentUserQueryKey = ['current-user']

/**
 * get current user query
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useCurrentUser = (options = {}) => {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: apiGetCurrentUser,
    select: (res) => {
      return {
        ...res.data,
        name: fullName(res.data),
      }
    },
    ...options,
  })
}

export default useCurrentUser
export { currentUserQueryKey }
