import { useMutation, useQueryClient } from '@tanstack/react-query'
import { myRequirementsQueryKey } from './get-my-requirements'
import { apiPatchRequirement } from '@/data/api/requirement'
import { generateGetRequirementQueryKey } from './get-requirement'

const useEditRequirement = (requirementId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiPatchRequirement(requirementId, data),
    ...options,
    onSuccess: (res) => {
      queryClient.removeQueries({ queryKey: myRequirementsQueryKey })
      queryClient.removeQueries({ queryKey: generateGetRequirementQueryKey(requirementId) })

      options.onSuccess?.(res)
    },
  })
}

export default useEditRequirement
