import UserListPage from '../pages/UserListPage'
import UserViewPage from '../pages/UserViewPage'
import UserCreationPage from '../pages/UserCreationPage'

import { CallDetailsList } from '../components/CallDetailsList'
import { UserFilesList } from '../components/UserFilesList'
import { UserAdsList } from '../components/UserAdsList'
import { UserRequirementsList } from '../components/UserRequirementsList'
import { UserContractsList } from '../components/UserContractsList'
import { UserDiscountsList } from '../components/UserDiscountsList'

/** @type {import('react-router-dom').RouteObject[]} */
const userRoutes = [
  {
    path: '/users',
    element: <UserListPage />,
  },
  {
    path: '/users/new',
    element: <UserCreationPage />,
  },
  {
    path: '/users/:id',
    element: <UserViewPage />,
    children: [
      { index: true, element: <CallDetailsList /> },
      { path: 'files', element: <UserFilesList /> },
      { path: 'ads', element: <UserAdsList /> },
      { path: 'requirements', element: <UserRequirementsList /> },
      { path: 'contracts', element: <UserContractsList /> },
      { path: 'discount', element: <UserDiscountsList /> },
    ],
  },
  {
    path: '/users/:id/edit',
    element: <UserCreationPage />,
  },
]

export { userRoutes }
