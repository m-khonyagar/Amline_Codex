import { withBaseLayout } from '@/features/app'
import { InvoicePage } from '@/features/invoice'

export default withBaseLayout(InvoicePage, { bottomNavigation: false, requireAuth: true })
