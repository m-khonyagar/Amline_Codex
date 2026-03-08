import { withBaseLayout } from '@/features/app'
import { BookmarksPage } from '@/features/requirements'

export default withBaseLayout(BookmarksPage, { bottomNavigation: true, requireAuth: true })
