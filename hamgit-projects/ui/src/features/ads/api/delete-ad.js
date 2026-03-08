import { useMutation } from '@tanstack/react-query'
import { apiDeleteAd } from '@/data/api/ad'

const useDeleteAd = (options = {}) => {
  return useMutation({
    mutationFn: (requirementId) => apiDeleteAd(requirementId),
    ...options,
    onSuccess: (res) => {
      options.onSuccess?.(res)
    },
  })
}

export default useDeleteAd
