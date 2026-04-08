import SettlementRequestsListPage from '../pages/SettlementRequestsListPage'

/** @type {import('react-router-dom').RouteObject[]} */
const settlementRoutes = [
  {
    path: '/settlements',
    element: <SettlementRequestsListPage />,
  },
]

export { settlementRoutes }
