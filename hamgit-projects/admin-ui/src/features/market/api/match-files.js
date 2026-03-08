import { useMutation } from '@tanstack/react-query'
import { apiMatchLandlordFile, apiMatchTenantFile } from '@/data/api/market'

export function useMatchLandlordFile(options = {}) {
  // const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileId) => apiMatchLandlordFile(fileId),
    onSuccess: (data, fileId, context) => {
      options.onSuccess?.(data, fileId, context)
    },
    onError: options.onError,
  })
}

export function useMatchTenantFile(options = {}) {
  // const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileId) => apiMatchTenantFile(fileId),
    onSuccess: (data, fileId, context) => {
      options.onSuccess?.(data, fileId, context)
    },
    onError: options.onError,
  })
}
