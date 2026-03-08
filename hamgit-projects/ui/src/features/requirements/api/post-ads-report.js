import { useMutation } from '@tanstack/react-query'
import { apiPostAdsReport } from '@/data/api/requirement'

const usePostAdsReport = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiPostAdsReport(data),
    ...options,
  })
}

export default usePostAdsReport
