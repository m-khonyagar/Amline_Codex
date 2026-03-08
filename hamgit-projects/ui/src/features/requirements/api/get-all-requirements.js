import { useInfiniteQuery } from '@tanstack/react-query'
import { apiGetAllRequirement } from '@/data/api/requirement'

const useGetRequirements = ({ limit = 30, filters = {}, cityIds }, options = {}) => {
  const filteredParams = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== false)
  )

  return useInfiniteQuery({
    queryKey: ['requirements', filteredParams],
    initialPageParam: { offset: 0 },
    queryFn: ({ pageParam }) =>
      apiGetAllRequirement({
        ...pageParam,
        ...filteredParams,
        limit,
        user_city_ids: cityIds,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.data?.length === limit) {
        return {
          offset: allPages.reduce((prev, curr) => prev + curr.data.length, 0),
        }
      }

      return undefined
    },
    ...options,
  })
}

export default useGetRequirements
