import { withBaseLayout } from '@/features/app'
import { ContractGuaranteePage } from '@/features/landing'

export default withBaseLayout(ContractGuaranteePage, {
  bgWhite: false,
  requireAuth: false,
  bottomNavigation: true,
})
