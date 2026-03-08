import LoginPage from '../pages/Login'

/** @type {import('react-router-dom').RouteObject[]} */
const authRoutes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
]

export { authRoutes }
