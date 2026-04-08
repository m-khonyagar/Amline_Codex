import { Page } from '@/features/misc'
import { NavLink, Outlet, useParams, useLocation } from 'react-router-dom'
import { UserInfo } from '../components/UserInfo'
import { cn } from '@/utils/dom'

const UserViewPage = () => {
  const { id: userId } = useParams()
  const location = useLocation()

  const tabs = [
    { path: `/users/${userId}`, label: 'جزئیات' },
    { path: `/users/${userId}/files`, label: 'فایل‌ها' },
    { path: `/users/${userId}/ads`, label: 'آگهی‌ها' },
    { path: `/users/${userId}/requirements`, label: 'نیازمندی‌ها' },
    { path: `/users/${userId}/contracts`, label: 'قراردادها' },
    { path: `/users/${userId}/discount`, label: 'کد تخفیف‌ها' },
  ]

  return (
    <Page title="اطلاعات کاربر">
      <UserInfo userId={userId} />

      <div className="inline-flex items-center gap-2 my-5 border-b border-[#E7E7E9]">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
          return (
            <NavLink
              key={tab.path}
              className={cn('py-1.5 px-2 font-medium text-[#6E6D7A] transition-colors', {
                'text-[#0D0C22] border-b border-[#252438]': isActive,
              })}
              to={tab.path}
            >
              {tab.label}
            </NavLink>
          )
        })}
      </div>

      <Outlet />
    </Page>
  )
}

export default UserViewPage
