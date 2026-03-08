import { useMutation, useQueryClient } from '@tanstack/react-query'
import { myRequirementsQueryKey } from './get-my-requirements'
import { apiDeleteRequirement } from '@/data/api/requirement'

const useDeleteRequirement = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (requirementId) => apiDeleteRequirement(requirementId),
    ...options,
    onSuccess: (res) => {
      queryClient.refetchQueries({ queryKey: myRequirementsQueryKey })

      options.onSuccess?.(res)
    },
  })
}

export default useDeleteRequirement
