import { withBaseLayout } from '@/features/app'
import { MyAccount } from '@/features/profile'

export default withBaseLayout(MyAccount, { bottomCTA: true, bgWhite: true, requireAuth: true })
