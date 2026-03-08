import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPatchCurrentUser } from '@/data/api/user'
import { generateGetContractQueryKey } from '@/features/contract'

/**
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const usePatchContractCreatorUser = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiPatchCurrentUser,

    ...options,

    onSuccess: (res) => {
      queryClient.setQueryData(generateGetContractQueryKey(contractId), (oldData) => {
        if (oldData?.data?.user?.id === res.data.id) {
          return { data: { ...oldData.data, user: res.data } }
        }

        if (oldData?.data?.data_user_second_side?.id === res.data.id) {
          return { data: { ...oldData.data, data_user_second_side: res.data } }
        }

        return oldData
      })

      options.onSuccess?.(res)
    },
  })
}

export default usePatchContractCreatorUser
