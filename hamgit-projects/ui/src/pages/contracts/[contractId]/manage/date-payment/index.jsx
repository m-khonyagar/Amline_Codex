import { withBaseLayout } from '@/features/app'
import { DateAndPaymentPage } from '@/features/contract'

export default withBaseLayout(DateAndPaymentPage, { requireAuth: true })
