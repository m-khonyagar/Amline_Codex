import { withBaseLayout } from '@/features/app'
import { DraftInquiryContractPage } from '@/features/contract'

export default withBaseLayout(DraftInquiryContractPage, {
  bgWhite: false,
  requireAuth: false,
})
