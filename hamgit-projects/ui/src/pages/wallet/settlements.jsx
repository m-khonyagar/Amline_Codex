import { withBaseLayout } from '@/features/app'
import { Settlements } from '@/features/wallet'

export default withBaseLayout(Settlements, {
  bottomNavigation: false,
  requireAuth: true,
  bgWhite: false,
})
