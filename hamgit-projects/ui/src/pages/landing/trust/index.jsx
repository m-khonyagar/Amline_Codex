import { withBaseLayout } from '@/features/app'
import { TrustPage } from '@/features/landing'

export default withBaseLayout(TrustPage, {
  bgWhite: false,
  requireAuth: false,
  bottomNavigation: true,
})
