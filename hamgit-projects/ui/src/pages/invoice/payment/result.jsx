import { withBaseLayout } from '@/features/app'
import { InvoiceResultPage } from '@/features/invoice'

export default withBaseLayout(InvoiceResultPage, {
  bottomNavigation: false,
  requireAuth: true,
  bgWhite: true,
  bottomCTA: true,
})
