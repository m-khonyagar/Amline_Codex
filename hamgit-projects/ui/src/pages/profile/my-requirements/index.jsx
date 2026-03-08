import { withBaseLayout } from '@/features/app'
import { MyRequirements } from '@/features/requirements'

export default withBaseLayout(MyRequirements, { bottomNavigation: true, requireAuth: true })
