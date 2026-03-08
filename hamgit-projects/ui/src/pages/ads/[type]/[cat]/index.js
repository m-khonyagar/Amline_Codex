import { withBaseLayout } from '@/features/app'
import { AdListPage } from '@/features/ads'

export default withBaseLayout(AdListPage, {
  bottomCTA: true,
  requireAuth: false,
  bottomNavigation: true,
})
