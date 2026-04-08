import { useQuery } from '@tanstack/react-query'
import { useChatContext } from '../providers/ChatProvider'
import { generateFindConversationQueryKey } from './query-keys'

/**
 * find conversation
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useFindConversation = (filters = {}, options = {}) => {
  const { supabase } = useChatContext()

  const { userId, receiverId } = filters

  return useQuery({
    queryKey: generateFindConversationQueryKey(filters),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select(
          `
            *,
            user1:user1_id (id, name),
            user2:user2_id (id, name)
          `
        )
        .or(
          `and(user1_id.eq.${userId},user2_id.eq.${receiverId}),and(user1_id.eq.${receiverId},user2_id.eq.${userId})`
        )
        .single()

      if (error) throw error

      return data
    },
    enabled: !!userId && !!receiverId && !!supabase,
    ...options,
  })
}

export default useFindConversation
