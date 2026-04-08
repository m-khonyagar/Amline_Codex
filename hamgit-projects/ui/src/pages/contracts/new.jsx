import { withBaseLayout } from '@/features/app'
import { ContractTypeSelectionPage } from '@/features/contract'

export default withBaseLayout(ContractTypeSelectionPage, { bottomCTA: true, requireAuth: true })
