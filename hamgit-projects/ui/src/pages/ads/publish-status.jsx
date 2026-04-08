import { withBaseLayout } from '@/features/app'
import { PublishStatusPage } from '@/features/ads'

export default withBaseLayout(PublishStatusPage, {
  bottomNavigation: false,
  requireAuth: true,
  bgWhite: true,
})
