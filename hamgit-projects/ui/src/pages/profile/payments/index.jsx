import { withBaseLayout } from '@/features/app'
import { ProfilePaymentsPage } from '@/features/profile'

export default withBaseLayout(ProfilePaymentsPage, { requireAuth: true })
