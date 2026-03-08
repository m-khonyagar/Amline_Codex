import { useInfiniteQuery } from '@tanstack/react-query'
import { apiGetMyRequirements } from '@/data/api/requirement'

const myRequirementsQueryKey = ['my-requirements']

const useGetMyRequirements = ({ limit = 30 }, options = {}) => {
  return useInfiniteQuery({
    queryKey: myRequirementsQueryKey,
    initialPageParam: { offset: 0 },
    queryFn: ({ pageParam }) => apiGetMyRequirements({ ...pageParam, limit }),
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

export default useGetMyRequirements
export { myRequirementsQueryKey }
