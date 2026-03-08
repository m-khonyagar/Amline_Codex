import { withBaseLayout } from '@/features/app'
import { Wallet } from '@/features/wallet'

export default withBaseLayout(Wallet, { bottomNavigation: true, requireAuth: true })
