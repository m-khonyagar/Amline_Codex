import { withBaseLayout } from '@/features/app'
import { LandlordPartyInformation } from '@/features/contract'

export default withBaseLayout(LandlordPartyInformation, {
  bgWhite: true,
  bottomCTA: true,
  requireAuth: true,
})
