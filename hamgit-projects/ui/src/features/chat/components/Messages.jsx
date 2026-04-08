import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import MessageInput from './MessageInput'
import { useGetMessages } from '../api/get-messages'
import MessagesHeader from './MessagesHeader'
import MessageItem from './MessageItem'
import { cn } from '@/utils/dom'
import { CircleLoadingIcon } from '@/components/icons'
import useGetConversation from '../api/get-conversation'
import { useAuthContext } from '@/features/auth'
import { useGetRequirement } from '@/features/requirements'
import { EntityTypeEnums } from '@/data/enums/entity_type_enums'
import MessagesEntityHeader from './MessagesEntityHeader'

import classes from './Messages.module.scss'

function Messages({ conversationId, receiverId, entityId, entityType }) {
  const router = useRouter()
  const messageListRef = useRef()
  const { currentUser } = useAuthContext()
  const userId = currentUser?.id

  const [firstFetched, setFirstFetched] = useState(false)
  const [hasNewMessages, setHasNewMessages] = useState(false)

  const messagesQuery = useGetMessages(conversationId)
  const conversationQuery = useGetConversation(conversationId)

  const requirementQuery = useGetRequirement(entityId, {
    enabled: !!entityId && entityType === EntityTypeEnums.REQUIREMENT,
  })

  const entityTypeQueries = {
    [EntityTypeEnums.REQUIREMENT]: requirementQuery,
  }

  const entityQuery = entityTypeQueries[entityType]

  const secondUser = useMemo(() => {
    if (conversationQuery.isSuccess && conversationQuery.data) {
      if (conversationQuery.data?.user1_id === userId) {
        return conversationQuery.data?.user2
      }

      if (conversationQuery.data?.user2_id === userId) {
        return conversationQuery.data?.user1
      }
    }

    if (receiverId)
      return {
        id: receiverId,
      }

    return null
  }, [conversationQuery.data, conversationQuery.isSuccess, receiverId, userId])

  const messages = useMemo(() => {
    return messagesQuery.data || []
  }, [messagesQuery])

  const goToLastMessage = () => {
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight

    setHasNewMessages(false)
  }

  const handleScroll = (e) => {
    if (e.target.scrollHeight - e.target.scrollTop - e.target.offsetHeight < 60) {
      setHasNewMessages(false)
    }
  }

  const sendMessageCallback = (message) => {
    if (!conversationId && message?.conversation_id) {
      router.replace({ query: { c: message.conversation_id } })
    }
  }

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messageListRef.current.style.scrollBehavior = firstFetched ? 'smooth' : 'initial'
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight
      }, 0)

      setFirstFetched(true)
    }
  }, [firstFetched, messages])

  useEffect(() => {
    if (conversationQuery.error?.details?.includes('0 rows')) router.replace({ query: {} })
  }, [conversationQuery.error?.details, router])

  return (
    <div className="flex-grow flex flex-col bg-white mx-4 mt-4 rounded-t-xl">
      <MessagesHeader user={secondUser} isLoading={conversationId && conversationQuery.isLoading} />

      {entityId && entityType && (
        <MessagesEntityHeader
          className="mt-4 mx-4"
          entity={entityQuery?.data}
          entityType={entityType}
          isLoading={entityQuery?.isLoading}
        />
      )}

      <div className="flex-grow relative flex flex-col">
        {messagesQuery.isLoading && (
          <div className="my-10 self-center">
            <CircleLoadingIcon size={14} className="animate-spin " />
          </div>
        )}

        <div
          ref={messageListRef}
          onScroll={handleScroll}
          className={cn(
            'flex-grow px-6 py-6 flex flex-col items-end gap-2 overflow-y-auto h-60 scroll-smooth transition-opacity',
            classes['message-list-container'],
            firstFetched ? 'opacity-1' : 'opacity-0'
          )}
        >
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>

        {hasNewMessages && (
          <button
            type="button"
            onClick={() => goToLastMessage()}
            className="bg-gray-50 rounded-full absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 text-sm text-teal-600"
          >
            پیام جدید
          </button>
        )}
      </div>

      <div>
        <MessageInput
          receiverId={secondUser?.id}
          conversationId={conversationId}
          onSend={sendMessageCallback}
        />
      </div>
    </div>
  )
}

export default Messages
