import { withBaseLayout } from '@/features/app'
import { AdCategoryPage } from '@/features/ads'

export default withBaseLayout(AdCategoryPage, {
  bottomNavigation: true,
  requireAuth: false,
  bgWhite: false,
})
