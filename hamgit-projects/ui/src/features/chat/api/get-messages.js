import { useQuery } from '@tanstack/react-query'
import { useChatContext } from '../providers/ChatProvider'
import { generateConversationMessagesQueryKey } from './query-keys'

/**
 * get messages by conversation id
 * @param {number} conversationId conversation id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetMessages = (conversationId, options = {}) => {
  const { supabase } = useChatContext()

  return useQuery({
    queryKey: generateConversationMessagesQueryKey(conversationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error

      return data
    },
    enabled: !!conversationId && !!supabase,
    ...options,
  })
}

export { useGetMessages }
