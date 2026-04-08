import ClausesPage from '../pages/Clauses'

/** @type {import('react-router-dom').RouteObject[]} */
const clausesRoutes = [
  {
    path: '/clauses/:type',
    element: <ClausesPage />,
  },
]

export { clausesRoutes }
