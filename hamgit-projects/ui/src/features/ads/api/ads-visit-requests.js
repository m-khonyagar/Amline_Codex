import { useMutation } from '@tanstack/react-query'
import { apiAdsVisitRequests } from '@/data/api/ad'

const useAdsVisitRequests = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiAdsVisitRequests(data),
    ...options,
    onSuccess: (res) => {
      options.onSuccess?.(res)
    },
  })
}

export default useAdsVisitRequests
