import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPatchNickname } from '@/data/api/user'
import { currentUserQueryKey } from '../../auth/api/get-current-user'

/**
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const usePatchNickname = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiPatchNickname,
    ...options,

    onSuccess: (res) => {
      queryClient.setQueryData(currentUserQueryKey, res)
      options.onSuccess?.(res)
    },
  })
}

export default usePatchNickname
