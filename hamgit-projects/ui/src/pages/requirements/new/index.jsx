import { withBaseLayout } from '@/features/app'
import { NewRequirementTypeSelectionPage } from '@/features/requirements'

export default withBaseLayout(NewRequirementTypeSelectionPage, {
  bottomNavigation: false,
  requireAuth: true,
})
