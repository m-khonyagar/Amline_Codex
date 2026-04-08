import { withBaseLayout } from '@/features/app'
import { MyAdsPage } from '@/features/ads'

export default withBaseLayout(MyAdsPage, { bottomNavigation: true, requireAuth: true })
