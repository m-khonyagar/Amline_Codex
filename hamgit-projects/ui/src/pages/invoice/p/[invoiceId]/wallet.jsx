import { withBaseLayout } from '@/features/app'
import { InvoiceWallet } from '@/features/invoice'

export default withBaseLayout(InvoiceWallet, {
  bottomNavigation: false,
  requireAuth: true,
})
