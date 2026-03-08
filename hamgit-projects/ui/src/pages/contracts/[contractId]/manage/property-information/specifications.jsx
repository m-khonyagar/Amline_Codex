import { withBaseLayout } from '@/features/app'
import { PropertySpecificationsPage } from '@/features/contract'

export default withBaseLayout(PropertySpecificationsPage, {
  bgWhite: true,
  bottomCTA: true,
  requireAuth: true,
})
