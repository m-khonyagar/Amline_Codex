import { useMutation, useQueryClient } from '@tanstack/react-query'
import { myRequirementsQueryKey } from './get-my-requirements'
import { apiPostRequirement } from '@/data/api/requirement'

const useCreateRequirement = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiPostRequirement(data),
    ...options,
    onSuccess: (res) => {
      queryClient.removeQueries({ queryKey: myRequirementsQueryKey })
      options.onSuccess?.(res)
    },
  })
}

export default useCreateRequirement
