import Image from 'next/image'
import { format } from 'date-fns-jalali'
import Link from 'next/link'
import { useMemo } from 'react'
import profileImg from '@/assets/images/profile.svg'
import { formatFromNow } from '@/utils/time'
import { useAuthContext } from '@/features/auth'

function ConversationItem({ conversation }) {
  const { currentUser } = useAuthContext()
  const today = new Date().setHours(0, 0, 0, 0)

  const userId = currentUser?.id

  const conversationTime = useMemo(() => {
    return conversation.last_message_time || conversation.created_at
  }, [conversation])

  const secondUser = useMemo(() => {
    if (conversation.user1_id === userId) {
      return conversation.user2
    }

    if (conversation.user2_id === userId) {
      return conversation.user1
    }

    return null
  }, [conversation, userId])

  return (
    <Link
      href={{ pathname: '/chat', query: { c: conversation.id } }}
      className="p-4 flex items-center gap-2 bg-white rounded-xl shadow-xl fa"
    >
      <Image src={profileImg.src} alt={conversation.user1_id} width={48} height={48} />

      <div className="w-full">
        <div className="flex items-start justify-between">
          <div className="text-sm">{secondUser?.name || 'کاربر املاین'}</div>
          <div className="text-xs">
            {today === new Date(conversationTime).setHours(0, 0, 0, 0)
              ? format(conversationTime, 'HH:mm')
              : formatFromNow(conversationTime)}
          </div>
        </div>

        {(conversation.last_message || conversation.title) && (
          <div className="text-xs mt-2">{conversation.last_message || conversation.title}</div>
        )}
      </div>
    </Link>
  )
}

export default ConversationItem
