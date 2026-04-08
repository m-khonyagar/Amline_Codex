import { withBaseLayout } from '@/features/app'
import { ContractManagement } from '@/features/contract'

export default withBaseLayout(ContractManagement, { requireAuth: true, bottomCTA: true })
