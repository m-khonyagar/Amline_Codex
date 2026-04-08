import { withBaseLayout } from '@/features/app'
import { Withdrawal } from '@/features/wallet'

export default withBaseLayout(Withdrawal, {
  bottomNavigation: false,
  requireAuth: true,
  bgWhite: false,
})
