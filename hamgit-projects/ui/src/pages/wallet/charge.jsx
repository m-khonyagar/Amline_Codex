import { withBaseLayout } from '@/features/app'
import { Charge } from '@/features/wallet'

export default withBaseLayout(Charge, { bottomNavigation: false, requireAuth: true, bgWhite: true })
