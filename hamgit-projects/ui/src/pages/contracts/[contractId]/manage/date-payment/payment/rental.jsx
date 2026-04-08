import { withBaseLayout } from '@/features/app'
import { PaymentInformationPage } from '@/features/contract'

export default withBaseLayout(PaymentInformationPage, { requireAuth: true, bottomCTA: true })
