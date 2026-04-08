import { withBaseLayout } from '@/features/app'
import { NewAdTypeSelectionPage } from '@/features/ads'

export default withBaseLayout(NewAdTypeSelectionPage, {
  bottomNavigation: false,
  requireAuth: true,
  bgWhite: true,
})
