import { withBaseLayout } from '@/features/app'
import { AboutUsPage } from '@/features/profile'

export default withBaseLayout(AboutUsPage, {
  bottomNavigation: false,
  requireAuth: false,
  bottomCTA: true,
})
