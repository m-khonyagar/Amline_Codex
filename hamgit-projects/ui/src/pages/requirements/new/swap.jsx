import { withBaseLayout } from '@/features/app'
import { EditSwapPage } from '@/features/requirements'

export default withBaseLayout(EditSwapPage, {
  bottomCTA: true,
  requireAuth: true,
})
