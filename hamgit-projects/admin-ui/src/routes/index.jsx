import publicRoutes from './public'
import protectedRoutes from './protected'
import { AppProvider } from '@/providers/AppProvider'
import { createBrowserRouter } from 'react-router-dom'

/** @type {import('react-router-dom').RouteObject[]} */
const routes = [
  {
    path: '/',
    element: <AppProvider />,
    children: [...protectedRoutes, ...publicRoutes],
  },
]

export default createBrowserRouter(routes)
