import { useQuery } from '@tanstack/react-query'
import { useChatContext } from '../providers/ChatProvider'

const generateChatProfileQueryKey = (id) => ['chat-profile', id]

/**
 * get chat profile by user id
 * @param {number} userId user id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetChatProfile = (userId, options = {}) => {
  const { supabase } = useChatContext()

  return useQuery({
    queryKey: generateChatProfileQueryKey(userId),
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (error) throw error
      return data
    },
    enabled: !!userId && !!supabase,
    ...options,
  })
}

export default useGetChatProfile
export { generateChatProfileQueryKey }
