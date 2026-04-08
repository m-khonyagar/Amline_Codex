import NewContractPage from '../pages/NewContractPage'
import PRContractListPage from '../pages/PRContractListPage'
import PRContractViewPage from '../pages/PRContractViewPage'
import PRContractViewPDFPage from '../pages/PRContractViewPDFPage'
import PRContractViewDetailsPage from '../pages/PRContractViewDetailsPage'
import PRContractViewPartiesPage from '../pages/PRContractViewPartiesPage'
import PRContractViewClausesPage from '../pages/PRContractViewClausesPage'
import PRContractViewPropertyPage from '../pages/PRContractViewPropertyPage'
import PRContractViewPaymentsPage from '../pages/PRContractViewPaymentsPage'
import PRContractViewCommissionsPage from '../pages/PRContractViewCommissionsPage'

/** @type {import('react-router-dom').RouteObject[]} */
const contractRoutes = [
  {
    path: '/contracts/new',
    element: <NewContractPage />,
  },
  {
    path: '/contracts/prs',
    element: <PRContractListPage />,
  },
  {
    path: '/contracts/prs/:id',
    element: <PRContractViewPage />,
    children: [
      {
        path: '',
        index: true,
        element: <PRContractViewDetailsPage />,
      },
      {
        path: 'parties',
        element: <PRContractViewPartiesPage />,
      },
      {
        path: 'property',
        element: <PRContractViewPropertyPage />,
      },
      {
        path: 'payments',
        element: <PRContractViewPaymentsPage />,
      },
      {
        path: 'commissions',
        element: <PRContractViewCommissionsPage />,
      },
      {
        path: 'clauses',
        element: <PRContractViewClausesPage />,
      },
      {
        path: 'pdf',
        element: <PRContractViewPDFPage />,
      },
    ],
  },
]

export { contractRoutes }
