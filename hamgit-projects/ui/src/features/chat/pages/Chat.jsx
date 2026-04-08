import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import Conversations from '../components/Conversations'
import Messages from '../components/Messages'
import { CircleLoadingIcon } from '@/components/icons'
import { HeaderNavigation, useAppContext } from '@/features/app'
import useGetChatProfile from '../api/get-profile'
import { useAuthContext } from '@/features/auth'
import ChatProfile from '../components/ChatProfile'
import { EntityTypeEnums } from '@/data/enums/entity_type_enums'
import useFindConversation from '../api/find-conversation'
import Retry from '@/components/Retry'

const supportedEntityTypes = [EntityTypeEnums.REQUIREMENT]

function ChatPage() {
  const router = useRouter()
  const { toggleBottomNavigation } = useAppContext()
  const { currentUser } = useAuthContext()
  const userId = currentUser?.id

  const conversationId = router.query.c
  const entityType = supportedEntityTypes.includes(Number(router.query.entity_type))
    ? Number(router.query.entity_type)
    : null
  const entityId = router.query.entity_id
  const receiverId = router.query.user_id

  const startWithReceiverId = !!receiverId && !conversationId

  const chatProfileQuery = useGetChatProfile(userId)
  const hasProfile = useMemo(() => {
    return !!chatProfileQuery.data?.name
  }, [chatProfileQuery.data])

  const findConversationQuery = useFindConversation({ userId, receiverId })
  useEffect(() => {
    if (findConversationQuery.isSuccess && findConversationQuery.data?.id)
      router.replace({ query: { c: findConversationQuery.data.id } })
  }, [findConversationQuery.data?.id, findConversationQuery.isSuccess, router])

  const isInitialLoading = useMemo(() => {
    return !router.isReady || chatProfileQuery.isPending || findConversationQuery.isLoading
  }, [router.isReady, chatProfileQuery.isPending, findConversationQuery.isLoading])

  const isError = useMemo(() => {
    if (chatProfileQuery.error) {
      return !chatProfileQuery.error?.details?.includes('0 rows')
    }

    if (findConversationQuery.error) {
      return !findConversationQuery.error?.details?.includes('0 rows')
    }

    return false
  }, [chatProfileQuery.error, findConversationQuery.error])

  useEffect(() => {
    toggleBottomNavigation(!conversationId && !entityId)

    return () => {
      toggleBottomNavigation(true)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, entityId])

  return (
    <div className="flex flex-col flex-grow">
      <HeaderNavigation title="گفتگوها" noIndex />

      {isInitialLoading && (
        <div className="my-auto mx-auto">
          <CircleLoadingIcon size={36} className="animate-spin text-teal-600" />
        </div>
      )}

      {!isInitialLoading && isError && (
        <div className="my-auto mx-auto">
          <Retry query={[chatProfileQuery, findConversationQuery]} />
        </div>
      )}

      {!isInitialLoading && !isError && !hasProfile && <ChatProfile className="my-auto" />}

      {!isInitialLoading && !isError && hasProfile && (
        <>
          {!conversationId && !startWithReceiverId && <Conversations />}

          {(!!conversationId || !!startWithReceiverId) && (
            <Messages
              conversationId={conversationId}
              receiverId={receiverId}
              entityId={entityId}
              entityType={entityType}
            />
          )}
        </>
      )}
    </div>
  )
}

export default ChatPage
