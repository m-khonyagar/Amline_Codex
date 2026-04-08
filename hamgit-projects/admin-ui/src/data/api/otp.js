import { useMutation } from '@tanstack/react-query'
import { apiRequest } from '../services'

export const useSendOtp = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiRequest.post('/admin/contracts/new/otp', data),
    onSuccess: (res) => options?.onSuccess?.(res),
    onError: (e) => options?.onError?.(e),
  })
}
