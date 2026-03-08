import { withBaseLayout } from '@/features/app'
import { PhonePropertyConsult } from '@/features/landing'

export default withBaseLayout(PhonePropertyConsult, {
  bgWhite: false,
  requireAuth: false,
  bottomNavigation: true,
})
