import { withBaseLayout } from '@/features/app'
import { PhoneTrackingCodePage } from '@/features/landing'

export default withBaseLayout(PhoneTrackingCodePage, {
  bgWhite: false,
  requireAuth: false,
  bottomNavigation: true,
})
