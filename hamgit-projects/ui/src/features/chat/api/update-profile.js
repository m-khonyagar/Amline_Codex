import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useChatContext } from '../providers/ChatProvider'
import { generateChatProfileQueryKey } from './get-profile'

/**
 * update chat profile
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useUpdateProfile = (options = {}) => {
  const { supabase } = useChatContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, name }) => {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: userId,
            name,
          },
          { ignoreDuplicates: false, onConflict: 'id' }
        )
        .select()
        .single()

      if (error) throw error

      return data
    },

    ...options,

    onSuccess: (res, { userId }) => {
      queryClient.setQueryData(generateChatProfileQueryKey(userId), () => res)
      options.onSuccess?.(res)
    },
  })
}

export default useUpdateProfile
