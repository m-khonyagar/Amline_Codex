import { withBaseLayout } from '@/features/app'
import { Transactions } from '@/features/wallet'

export default withBaseLayout(Transactions, {
  bottomNavigation: false,
  requireAuth: true,
  bgWhite: false,
})
