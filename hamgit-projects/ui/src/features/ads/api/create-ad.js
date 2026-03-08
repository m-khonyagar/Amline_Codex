import { useMutation } from '@tanstack/react-query'
import { apiPostAd } from '@/data/api/ad'

const useCreateAd = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiPostAd(data),
    ...options,
    onSuccess: (res) => {
      options.onSuccess?.(res)
    },
  })
}

export default useCreateAd
