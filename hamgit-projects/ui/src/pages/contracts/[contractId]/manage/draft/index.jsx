import { withBaseLayout } from '@/features/app'
import { DraftInformation } from '@/features/contract'

export default withBaseLayout(DraftInformation, { bottomCTA: true, requireAuth: true })
