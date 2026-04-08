import { withBaseLayout } from '@/features/app'
import { ProfilePage } from '@/features/profile'

export default withBaseLayout(ProfilePage, {
  bottomNavigation: true,
  requireAuth: false,
  bgWhite: true,
})
