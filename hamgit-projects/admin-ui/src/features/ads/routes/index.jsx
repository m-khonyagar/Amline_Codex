import AdCreationPage from '../pages/AdCreationPage'
import AdsListPage from '../pages/AdsListPage'
import AdViewPage from '../pages/AdViewPage'
import AdsVisitRequestsListPage from '../pages/AdsVisitRequestsListPage'

/** @type {import('react-router-dom').RouteObject[]} */
const adsRoutes = [
  {
    path: '/ads/list',
    element: <AdsListPage />,
  },
  {
    path: '/ads/list/create',
    element: <AdCreationPage />,
  },
  {
    path: '/ads/list/:id',
    element: <AdViewPage />,
  },
  {
    path: '/ads/list/:id/edit',
    element: <AdCreationPage />,
  },
  {
    path: '/ads/visit-requests',
    element: <AdsVisitRequestsListPage />,
  },
]

export { adsRoutes }
