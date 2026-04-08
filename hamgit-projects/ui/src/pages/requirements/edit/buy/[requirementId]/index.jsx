import { withBaseLayout } from '@/features/app'
import { EditWantedPage } from '@/features/requirements'

export default withBaseLayout(EditWantedPage, {
  bgWhite: true,
  bottomCTA: true,
  requireAuth: true,
})
