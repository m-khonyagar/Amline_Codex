import { withBaseLayout } from '@/features/app'
import { EditSwapPage } from '@/features/requirements'

export default withBaseLayout(EditSwapPage, {
  bgWhite: true,
  bottomCTA: true,
  requireAuth: true,
})
