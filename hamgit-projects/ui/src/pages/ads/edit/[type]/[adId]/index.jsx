import { withBaseLayout } from '@/features/app'
import { EditAdPage } from '@/features/ads'

export default withBaseLayout(EditAdPage, {
  bottomNavigation: false,
  requireAuth: true,
  bgWhite: true,
})
