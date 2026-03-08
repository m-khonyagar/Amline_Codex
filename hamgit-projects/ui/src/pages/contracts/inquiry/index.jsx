import { withBaseLayout } from '@/features/app'
import { InquiryContractPage } from '@/features/contract'

export default withBaseLayout(InquiryContractPage, {
  bgWhite: false,
  requireAuth: false,
})
