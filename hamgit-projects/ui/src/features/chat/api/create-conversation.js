import { useMutation } from '@tanstack/react-query'
import { useChatContext } from '../providers/ChatProvider'
import useChatUpdater from './updater'

/**
 * create conversation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useCreateConversation = (options = {}) => {
  const { supabase } = useChatContext()
  const { upsertConversation } = useChatUpdater()

  return useMutation({
    mutationFn: async ({ senderId, receiverId, title }) => {
      const { data, error } = await supabase
        .from('conversations')
        .insert([
          {
            title,
            user1_id: senderId,
            user2_id: receiverId,
          },
        ])
        .select()
        .single()

      if (error) throw error

      return data
    },

    ...options,

    onSuccess: (res, { receiverId }) => {
      upsertConversation(res)

      const channel = supabase.channel(`chat-user-${receiverId}`)

      channel.send({
        type: 'broadcast',
        event: 'new-conversation',
        payload: { new: res },
      })

      supabase.removeChannel(channel)
      options.onSuccess?.(res)
    },
  })
}

export default useCreateConversation
