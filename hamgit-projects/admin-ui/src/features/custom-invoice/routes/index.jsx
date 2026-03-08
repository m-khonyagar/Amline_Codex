import CustomInvoiceListPage from '../pages/CustomInvoiceListPage'

/** @type {import('react-router-dom').RouteObject[]} */
const customInvoiceRoutes = [
  {
    path: '/custom-invoices',
    element: <CustomInvoiceListPage />,
  },
]

export { customInvoiceRoutes }
