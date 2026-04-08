import { withBaseLayout } from '@/features/app'
import { TenantPartyInformation } from '@/features/contract'

export default withBaseLayout(TenantPartyInformation, {
  bgWhite: true,
  bottomCTA: true,
  requireAuth: true,
})
