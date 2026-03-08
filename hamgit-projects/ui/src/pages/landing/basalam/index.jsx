import { withBaseLayout } from '@/features/app'
import { BasalamPage } from '@/features/landing'

export default withBaseLayout(BasalamPage, {
  bgWhite: false,
  requireAuth: false,
  bottomNavigation: false,
})
