import { authRoutes } from '@/features/auth'
import ErrorLayout from '../layouts/error'
import PublicLayout from '../layouts/public'
import { NotFoundPage } from '@/features/misc'

/** @type {import('react-router-dom').RouteObject[]} */
const publicRoutes = [
  {
    path: '/',
    children: [...authRoutes],
    element: <PublicLayout />,
    // errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <ErrorLayout />,
    children: [
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]
export default publicRoutes
