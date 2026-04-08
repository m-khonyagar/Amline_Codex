import { withBaseLayout } from '@/features/app'
import { DownloadAppPage } from '@/features/landing'

export default withBaseLayout(DownloadAppPage, {
  bottomNavigation: false,
  requireAuth: false,
  bottomCTA: false,
})
