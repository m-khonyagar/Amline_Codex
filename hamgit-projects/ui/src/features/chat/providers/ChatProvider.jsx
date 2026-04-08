import { createContext, useContext, useEffect, useMemo } from 'react'
import { getAccessToken, useAuthContext } from '@/features/auth'
import { getSupabaseClient } from '../libs/supabase'
import useChatUpdater from '../api/updater'
import useSupabaseToken from '../api/get-supabase-token'

/**
 * @typedef TChatContext
 * @property {import('@supabase/supabase-js').SupabaseClient} supabase
 * @property {import('@supabase/supabase-js').RealtimeChannel} chatChannel
 */

/** @type {import('react').Context<TChatContext>} */
const ChatContext = createContext({})

const useChatContext = () => {
  const context = useContext(ChatContext)

  if (context === undefined) {
    throw new Error('useChatContext was used outside of its Provider')
  }

  return context
}

function ChatProvider({ children }) {
  const { isLoggedIn, currentUser } = useAuthContext()
  const { upsertMessage } = useChatUpdater()

  const { data: supabaseToken } = useSupabaseToken(getAccessToken())

  const userId = currentUser?.id

  // Because the supabase loads slowly, requests are not sent on time.
  const supabase = useMemo(() => {
    if (isLoggedIn && !!supabaseToken) {
      return getSupabaseClient(supabaseToken.token)
    }

    return null
  }, [isLoggedIn, supabaseToken])

  const chatChannel = useMemo(() => {
    if (userId && supabase) {
      return supabase.channel(`chat-user-${userId}`)
    }

    return null
  }, [supabase, userId])

  useEffect(() => {
    chatChannel
      ?.on('broadcast', { event: 'new-message' }, ({ payload }) => {
        if (payload.new) {
          upsertMessage(payload.new, { event: 'new' })
        }
      })
      .subscribe()

    return () => {
      if (supabase && chatChannel) {
        supabase.removeChannel(chatChannel)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, chatChannel])

  const values = useMemo(() => ({ supabase, chatChannel }), [supabase, chatChannel])

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>
}

export { useChatContext, ChatProvider }
