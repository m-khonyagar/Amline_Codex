import RequirementsListPage from '../pages/RequirementsListPage'
import RequirementViewPage from '../pages/RequirementViewPage'
import RequirementCreationPage from '../pages/RequirementCreationPage'
import BarterListPage from '../pages/BarterListPage'
import BarterViewPage from '../pages/BarterViewPage'
import BarterCreationPage from '../pages/BarterCreationPage'

/** @type {import('react-router-dom').RouteObject[]} */
const requirementsRoutes = [
  {
    path: '/requirements/buy-and-rental',
    element: <RequirementsListPage />,
  },
  {
    path: '/requirements/buy-and-rental/create',
    element: <RequirementCreationPage />,
  },
  {
    path: '/requirements/buy-and-rental/:id',
    element: <RequirementViewPage />,
  },
  {
    path: '/requirements/buy-and-rental/:id/edit',
    element: <RequirementCreationPage />,
  },
  {
    path: '/requirements/barter',
    element: <BarterListPage />,
  },
  {
    path: '/requirements/barter/create',
    element: <BarterCreationPage />,
  },
  {
    path: '/requirements/barter/:id',
    element: <BarterViewPage />,
  },
  {
    path: '/requirements/barter/:id/edit',
    element: <BarterCreationPage />,
  },
]

export { requirementsRoutes }
