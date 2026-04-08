import { withBaseLayout } from '@/features/app'
import { DateInformationPage } from '@/features/contract'

export default withBaseLayout(DateInformationPage, {
  bottomCTA: true,
  bgWhite: true,
  requireAuth: true,
})
