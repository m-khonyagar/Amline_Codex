import { withBaseLayout } from '@/features/app'
import { ContractListPage } from '@/features/contract'

export default withBaseLayout(ContractListPage, { bottomNavigation: true, requireAuth: true })
