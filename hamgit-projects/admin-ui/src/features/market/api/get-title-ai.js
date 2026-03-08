import { useMutation } from '@tanstack/react-query'
import { apiGetTitleAi } from '@/data/api/market'

export const useGetTitleAi = (fileId, options = {}) => {
  return useMutation({
    mutationFn: () => apiGetTitleAi(fileId),
    ...options,
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context)
    },
  })
}
