import { ErrorPage, withBaseLayout } from '@/features/app'

export default withBaseLayout(ErrorPage.bind(null, { error: { code: 404 } }))
