import { useQuery } from '@tanstack/react-query'
import { useChatContext } from '../providers/ChatProvider'
import { generateConversationQueryKey } from './query-keys'

/**
 * get conversation by
 * @param {number} conversationId conversation id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetConversation = (conversationId, options = {}) => {
  const { supabase } = useChatContext()

  return useQuery({
    queryKey: generateConversationQueryKey(conversationId),
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
        .eq('id', conversationId)
        .single()

      if (error) throw error

      return data
    },
    enabled: !!conversationId && !!supabase,
    ...options,
  })
}

export default useGetConversation
