import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { CircleLoadingIcon, SendIcon } from '@/components/icons'
import { useAuthContext } from '@/features/auth'
import useChatUpdater from '../api/updater'
import useCreateConversation from '../api/create-conversation'
import { handleErrorOnSubmit } from '@/utils/error'
import useUpdateProfile from '../api/update-profile'

function MessageInput({ conversationId, receiverId, onSend }) {
  const [content, setContent] = useState('')
  const { currentUser } = useAuthContext()
  const { upsertMessage, upsertConversation } = useChatUpdater()
  const createConversationMutation = useCreateConversation()
  const updateProfileMutation = useUpdateProfile()

  const userId = currentUser?.id

  const isLoading = createConversationMutation.isPending || updateProfileMutation.isPending

  const handleSend = async () => {
    if (content.length === 0) return
    if (!conversationId && !receiverId) return

    let _conversationId = conversationId

    if (!conversationId) {
      try {
        await updateProfileMutation.mutateAsync({
          userId: receiverId,
        })

        const conversation = await createConversationMutation.mutateAsync({
          // title,
          senderId: userId,
          receiverId,
        })

        _conversationId = conversation.id
        upsertConversation(conversation)
      } catch (error) {
        handleErrorOnSubmit(error)
        return
      }
    }

    const messageData = {
      id: uuidv4(),
      content,
      sender_id: userId,
      conversation_id: _conversationId,
      metadata: {
        isNew: true,
        receiverId,
      },
    }

    upsertMessage(messageData)

    setContent('')
    onSend?.(messageData)
  }

  return (
    <div className="flex w-full px-6 py-4 shadow-xl">
      <Input
        name="message"
        value={content}
        floatError
        placeholder="اینجا بنویسید"
        autoComplete="off"
        className="w-full"
        disabled={isLoading}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        suffixAction={
          <Button
            size="icon"
            variant="ghost"
            className="text-primary"
            disabled={isLoading}
            onClick={handleSend}
          >
            {isLoading ? <CircleLoadingIcon className="animate-spin" /> : <SendIcon />}
          </Button>
        }
      />
    </div>
  )
}

export default MessageInput
