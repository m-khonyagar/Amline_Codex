import { useMutation } from '@tanstack/react-query'
import { useChatContext } from '../providers/ChatProvider'
import useChatUpdater from './updater'

/**
 * send chat message
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useSendMessage = (options = {}) => {
  const { supabase } = useChatContext()
  const { upsertMessage } = useChatUpdater()

  return useMutation({
    mutationFn: async ({ senderId, conversationId, content }) => {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            content,
            conversation_id: conversationId,
            sender_id: senderId,
          },
        ])
        .select()
        .single()

      if (error) throw error

      return data
    },

    ...options,

    onSuccess: (res, { id, metadata }) => {
      upsertMessage(res, { messageId: id, event: 'new' })

      const channel = supabase.channel(`chat-user-${metadata.receiverId}`, {
        config: { broadcast: { self: true } },
      })

      channel.send({
        type: 'broadcast',
        event: 'new-message',
        payload: { new: res },
      })

      supabase.removeChannel(channel)
      options.onSuccess?.(res)
    },
  })
}

export default useSendMessage
