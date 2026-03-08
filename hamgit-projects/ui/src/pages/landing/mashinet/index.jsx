import { withBaseLayout } from '@/features/app'
import { MashinetLandingPage } from '@/features/landing'

export default withBaseLayout(MashinetLandingPage, {
  bgWhite: false,
  requireAuth: false,
  bottomNavigation: false,
})
