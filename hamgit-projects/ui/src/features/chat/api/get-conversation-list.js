import { useQuery } from '@tanstack/react-query'
import { useChatContext } from '../providers/ChatProvider'
import { generateConversationListQueryKey } from './query-keys'

/**
 * get conversations by user id
 * @param {number} userId user id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetConversationList = (userId, options = {}) => {
  const { supabase } = useChatContext()

  return useQuery({
    queryKey: generateConversationListQueryKey(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversations_with_last_message')
        .select(
          `
            *,
            user1:user1_id (id, name),
            user2:user2_id (id, name)
          `
        )
        .or(`user1_id.eq.${userId}, user2_id.eq.${userId}`)

      if (error) throw error

      return data
    },
    enabled: !!userId && !!supabase,
    ...options,
  })
}

export { useGetConversationList }
