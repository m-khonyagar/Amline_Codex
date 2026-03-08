import { withBaseLayout } from '@/features/app'
import { WithdrawalResult } from '@/features/wallet'

export default withBaseLayout(WithdrawalResult, {
  bottomNavigation: false,
  requireAuth: true,
  bgWhite: true,
})
