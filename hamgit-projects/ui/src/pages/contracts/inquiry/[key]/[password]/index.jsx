import { withBaseLayout } from '@/features/app'
import { ResultInquiryContractPage } from '@/features/contract'

export default withBaseLayout(ResultInquiryContractPage, {
  bgWhite: false,
  requireAuth: false,
})
