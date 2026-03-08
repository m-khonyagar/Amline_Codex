import { withBaseLayout } from '@/features/app'
import { ScanInquiryContractPage } from '@/features/contract'

export default withBaseLayout(ScanInquiryContractPage, {
  bgWhite: false,
  requireAuth: false,
})
