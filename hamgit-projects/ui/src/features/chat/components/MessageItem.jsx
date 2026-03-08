import { useEffect } from 'react'
import { format } from 'date-fns-jalali'
import { useAuthContext } from '@/features/auth'
import { cn } from '@/utils/dom'
import useSendMessage from '../api/send-message'
import { CheckDoubleIcon, CheckIcon, CircleLoadingIcon, InfoIcon } from '@/components/icons'
import { formatFromNow } from '@/utils/time'

function MessageItem({ message }) {
  const { currentUser } = useAuthContext()
  const sendMessageMutation = useSendMessage()
  const today = new Date().setHours(0, 0, 0, 0)

  const userId = currentUser?.id

  useEffect(() => {
    if (message.metadata?.isNew) {
      sendMessageMutation.mutate({
        id: message.id,
        content: message.content,
        metadata: message.metadata,
        senderId: message.sender_id,
        receiverId: message.receiver_id,
        conversationId: message.conversation_id,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message])

  return (
    <div
      key={message.id}
      className={cn(
        'px-3 py-2 bg-teal-50 rounded-2xl',
        userId === message.sender_id
          ? 'self-start bg-gray-400 rounded-es-none'
          : 'self-end bg-rust-100 rounded-ee-none'
      )}
    >
      <div className={cn(userId === message.sender_id ? 'text-gray-900' : 'text-rust-600')}>
        {message.content}
      </div>

      <div
        className={cn(
          'mt-2 flex items-center gap-2 fa text-xs',
          userId === message.sender_id ? 'text-gray-300' : 'text-rust-400 flex-row-reverse'
        )}
      >
        {sendMessageMutation.isPending && <CircleLoadingIcon size={14} className="animate-spin " />}

        {sendMessageMutation.isError && <InfoIcon size={14} className="text-yellow-600" />}

        {!message.metadata?.isNew && !message.seen_at && <CheckIcon size={14} />}

        {!message.metadata?.isNew && message.seen_at && <CheckDoubleIcon size={14} />}

        <span className="text-xs">
          {today === new Date(message.created_at).setHours(0, 0, 0, 0)
            ? format(message.created_at, 'HH:mm')
            : formatFromNow(message.created_at)}
        </span>
      </div>
    </div>
  )
}

export default MessageItem
