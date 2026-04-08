import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPatchAd } from '@/data/api/ad'
import { generateGetAdQueryKey } from './get-ad'

const useEditAd = (requirementId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiPatchAd(requirementId, data),
    ...options,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: generateGetAdQueryKey(requirementId) })
      options.onSuccess?.(res)
    },
  })
}

export default useEditAd
