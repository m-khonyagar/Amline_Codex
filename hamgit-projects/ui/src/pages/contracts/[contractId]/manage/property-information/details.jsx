import { withBaseLayout } from '@/features/app'
import { PropertyDetailsPage } from '@/features/contract'

export default withBaseLayout(PropertyDetailsPage, {
  bgWhite: true,
  bottomCTA: true,
  requireAuth: true,
})
