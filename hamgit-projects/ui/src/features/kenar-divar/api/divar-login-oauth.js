import { useMutation } from '@tanstack/react-query'
import { apiRequest } from '@/data/services'

/**
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useDivarLogin = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiRequest.post('/kenar-divar/login', data),
    ...options,
  })
}

export default useDivarLogin
