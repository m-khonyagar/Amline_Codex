import { withBaseLayout } from '@/features/app'
import { PaymentPage } from '@/features/contract'

export default withBaseLayout(PaymentPage, { requireAuth: true })
