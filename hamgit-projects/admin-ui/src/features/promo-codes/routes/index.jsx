import PromoCodesPage from '../pages/PromoCodesPage'
import CreatePromoCodePage from '../pages/CreatePromoCodePage'

/** @type {import('react-router-dom').RouteObject[]} */
const promoCodesRoutes = [
  {
    path: '/promo-codes',
    element: <PromoCodesPage />,
  },
  {
    path: '/promo-codes/create',
    element: <CreatePromoCodePage />,
  },
]

export { promoCodesRoutes }
