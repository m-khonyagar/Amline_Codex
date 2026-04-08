import { withBaseLayout } from '@/features/app'
import { PublishStatusPage } from '@/features/requirements'

export default withBaseLayout(PublishStatusPage, {
  bottomNavigation: false,
  requireAuth: true,
  bgWhite: true,
})
