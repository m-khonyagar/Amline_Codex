import { withBaseLayout } from '@/features/app'
import { PropertyFeaturesPage } from '@/features/contract'

export default withBaseLayout(PropertyFeaturesPage, {
  bgWhite: true,
  bottomCTA: true,
  requireAuth: true,
})
