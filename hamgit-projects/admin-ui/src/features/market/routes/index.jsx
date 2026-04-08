import { Navigate, Outlet } from 'react-router-dom'

// Pages
import SettingsPage from '../pages/SettingsPage'

// Deposit & Rent Pages
import DepositRentCreatePage from '../pages/DepositRentCreatePage'
import DepositRentListPage from '../pages/DepositRentListPage'
import DepositRentUpdatePage from '../pages/DepositRentUpdatePage'
import DepositRentInfoPage from '../pages/DepositRentInfoPage'
import DepositRentArchivePage from '../pages/DepositRentArchivePage'

// Buy & Sell Pages
import BuySellCreatePage from '../pages/BuySellCreatePage'
import BuySellListPage from '../pages/BuySellListPage'
import BuySellInfoPage from '../pages/BuySellInfoPage'
import BuySellUpdatePage from '../pages/BuySellUpdatePage'
import BuySellArchivePage from '../pages/BuySellArchivePage'

// Realtor Pages
import RealtorListPage from '../pages/RealtorListPage'
import RealtorCreatePage from '../pages/RealtorCreatePage'
import RealtorUpdatePage from '../pages/RealtorUpdatePage'
import RealtorInfoPage from '../pages/RealtorInfoPage'

// Task Pages
import TaskListPage from '../pages/TaskListPage'
import TaskCreatePage from '../pages/TaskCreatePage'
import TaskInfoPage from '../pages/TaskInfoPage'
import TaskUpdatePage from '../pages/TaskUpdatePage'

/** @type {import('react-router-dom').RouteObject[]} */
const marketRoutes = [
  {
    path: '/market',
    element: <Outlet />,
    children: [
      { index: true, element: <Navigate to="/market/deposit-rent" replace /> },

      // --- DEPOSIT & RENT ROUTES ---
      {
        path: 'deposit-rent',
        element: <Outlet />,
        children: [
          { index: true, element: <Navigate to="/market/deposit-rent/landlord" replace /> },
          { path: ':role', element: <DepositRentListPage /> },
          { path: ':role/create', element: <DepositRentCreatePage /> },
          { path: ':role/:id', element: <DepositRentInfoPage /> },
          { path: ':role/:id/edit', element: <DepositRentUpdatePage /> },
          { path: ':role/archive', element: <DepositRentArchivePage /> },
        ],
      },

      // --- BUY & SELL ROUTES (TODO) ---
      {
        path: 'buy-sell',
        element: <Outlet />,
        children: [
          { index: true, element: <Navigate to="/market/buy-sell/buyer" replace /> },
          { path: ':role', element: <BuySellListPage /> },
          { path: ':role/create', element: <BuySellCreatePage /> },
          { path: ':role/:id', element: <BuySellInfoPage /> },
          { path: ':role/:id/edit', element: <BuySellUpdatePage /> },
          { path: ':role/archive', element: <BuySellArchivePage /> },
        ],
      },

      // --- REALTOR ROUTES ---
      {
        path: 'realtor',
        element: <Outlet />,
        children: [
          { index: true, element: <RealtorListPage /> },
          { path: 'create', element: <RealtorCreatePage /> },
          { path: ':id', element: <RealtorInfoPage /> },
          { path: ':id/edit', element: <RealtorUpdatePage /> },
        ],
      },

      // --- TASK ROUTES ---
      {
        path: 'task',
        element: <Outlet />,
        children: [
          { index: true, element: <TaskListPage /> },
          { path: 'create', element: <TaskCreatePage /> },
          { path: ':id', element: <TaskInfoPage /> },
          { path: ':id/edit', element: <TaskUpdatePage /> },
        ],
      },

      // --- SETTINGS ROUTE ---
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]

export { marketRoutes }
