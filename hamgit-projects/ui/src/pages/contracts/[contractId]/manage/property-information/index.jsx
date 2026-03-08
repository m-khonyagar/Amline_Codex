import { withBaseLayout } from '@/features/app'
import { PropertyInformationPage } from '@/features/contract'

export default withBaseLayout(PropertyInformationPage, { requireAuth: true })
