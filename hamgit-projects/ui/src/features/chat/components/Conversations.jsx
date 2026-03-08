import React, { useMemo } from 'react'
import { useAuthContext } from '@/features/auth'
import { useGetConversationList } from '../api/get-conversation-list'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import ConversationItem from './ConversationItem'

function Conversations() {
  const { currentUser } = useAuthContext()
  const userId = currentUser?.id

  const conversationListQuery = useGetConversationList(userId)

  const conversations = useMemo(() => {
    return [...(conversationListQuery.data || [])].sort(
      (a, b) =>
        (b.last_message_time ? new Date(b.last_message_time) : 0) -
        (a.last_message_time ? new Date(a.last_message_time) : 0)
    )
  }, [conversationListQuery.data])

  return (
    <div className="flex-grow flex flex-col gap-4 py-4 px-6">
      <LoadingAndRetry query={conversationListQuery} skeletonItemHeight={70}>
        {!conversationListQuery.isPending && conversations.length === 0 && (
          <div className="my-auto mx-auto">گفتگویی وجود ندارد</div>
        )}

        {conversations.map((conversation) => (
          <ConversationItem key={conversation.id} conversation={conversation} />
        ))}
      </LoadingAndRetry>
    </div>
  )
}

export default Conversations
