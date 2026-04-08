// https://github.com/supabase/supabase-js/issues/553

import { createClient } from '@supabase/supabase-js'
import { isServerSide } from '@/utils/environment'

let supabase
const isServer = isServerSide()

function createSupabaseClient(accessToken) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    console.warn('[Supabase] Missing environment variables.')
    return null
  }

  const client = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })

  // client.realtime.setAuth(accessToken)

  return client
}

/**
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
function getSupabaseClient(accessToken) {
  if (supabase && !isServer) return supabase

  if (!isServer) {
    supabase = createSupabaseClient(accessToken)

    return supabase
  }

  return createSupabaseClient(accessToken)
}

export { getSupabaseClient }
