import { withBaseLayout } from '@/features/app'
import { ChatPage } from '@/features/chat'

export default withBaseLayout(ChatPage, {
  bottomNavigation: true,
  requireAuth: true,
})
