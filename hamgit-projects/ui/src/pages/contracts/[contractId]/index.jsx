import { withBaseLayout } from '@/features/app'
import { ContractPage } from '@/features/contract'

export default withBaseLayout(ContractPage, { bottomCTA: true, requireAuth: true })
