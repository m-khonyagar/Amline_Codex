import { useQueryClient } from '@tanstack/react-query'
import {
  generateConversationListQueryKey,
  generateConversationMessagesQueryKey,
} from './query-keys'
import { useAuthContext } from '@/features/auth'

const useChatUpdater = () => {
  const { currentUser } = useAuthContext()
  const queryClient = useQueryClient()

  const userId = currentUser?.id

  const upsertConversation = (conversation) => {
    const result = { isNew: false }

    queryClient.setQueryData(generateConversationListQueryKey(userId), (oldData) => {
      if (!oldData) return oldData

      const findIndex = oldData.findIndex((c) => c.id === conversation.id)

      if (findIndex === -1) {
        result.isNew = true
        return [...oldData, conversation]
      }
      return oldData.map((c) => (c.id === conversation.id ? { ...c, ...conversation } : c))
    })

    return result
  }

  const upsertMessage = (message, { messageId = null, event = null } = {}) => {
    const _messageId = messageId || message.id
    const result = { isNew: false }

    queryClient.setQueryData(
      generateConversationMessagesQueryKey(message.conversation_id),
      (oldData) => {
        let _oldData = oldData

        if (message?.metadata?.isNew && !oldData) {
          _oldData = []
        }

        if (!_oldData) return _oldData

        const findIndex = _oldData.findIndex((m) => m.id === _messageId)

        if (findIndex === -1) {
          result.isNew = true
          return [..._oldData, message]
        }
        return _oldData.map((m) => (m.id === _messageId ? message : m))
      }
    )

    if (message.created_at && event === 'new') {
      upsertConversation({
        id: message.conversation_id,
        last_sender_id: message.sender_id,
        last_message: message.content,
        last_message_time: message.created_at,
      })
    }

    return result
  }

  return { upsertConversation, upsertMessage }
}

export default useChatUpdater
