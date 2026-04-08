import { Page } from '@/features/misc'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import PRContractInfo from '../components/PRContractInfo/PRContractInfo'
import { cn } from '@/utils/dom'

const PRContractViewPage = () => {
  const { id: contractId } = useParams()

  return (
    <Page title={`قرارداد رهن و اجاره ${contractId}`} className="">
      <PRContractInfo contractId={contractId} />

      <div className="mt-4 flex items-center gap-4 border-b-2 overflow-x-auto overflow-y-hidden ">
        <NavLink
          end
          replace
          to={`/contracts/prs/${contractId}`}
          className={({ isActive }) =>
            cn(
              'px-2 py-1 text-gray-500 border-b-2 border-transparent whitespace-nowrap',
              isActive ? 'font-semibold text-primary border-primary' : ''
            )
          }
        >
          جزییات
        </NavLink>

        <NavLink
          replace
          to={`/contracts/prs/${contractId}/parties`}
          className={({ isActive }) =>
            cn(
              'px-2 py-1 text-gray-500 border-b-2 border-transparent whitespace-nowrap',
              isActive ? 'font-semibold text-primary border-primary' : ''
            )
          }
        >
          طرفین قرارداد
        </NavLink>

        <NavLink
          replace
          to={`/contracts/prs/${contractId}/property`}
          className={({ isActive }) =>
            cn(
              'px-2 py-1 text-gray-500 border-b-2 border-transparent whitespace-nowrap',
              isActive ? 'font-semibold text-primary border-primary' : ''
            )
          }
        >
          اطلاعات ملک
        </NavLink>

        <NavLink
          replace
          to={`/contracts/prs/${contractId}/payments`}
          className={({ isActive }) =>
            cn(
              'px-2 py-1 text-gray-500 border-b-2 border-transparent whitespace-nowrap',
              isActive ? 'font-semibold text-primary border-primary' : ''
            )
          }
        >
          پرداخت‌ها
        </NavLink>

        <NavLink
          replace
          to={`/contracts/prs/${contractId}/commissions`}
          className={({ isActive }) =>
            cn(
              'px-2 py-1 text-gray-500 border-b-2 border-transparent whitespace-nowrap',
              isActive ? 'font-semibold text-primary border-primary' : ''
            )
          }
        >
          کمیسیون
        </NavLink>

        <NavLink
          replace
          to={`/contracts/prs/${contractId}/clauses`}
          className={({ isActive }) =>
            cn(
              'px-2 py-1 text-gray-500 border-b-2 border-transparent whitespace-nowrap',
              isActive ? 'font-semibold text-primary border-primary' : ''
            )
          }
        >
          بندهای قرارداد
        </NavLink>

        <NavLink
          replace
          to={`/contracts/prs/${contractId}/pdf`}
          className={({ isActive }) =>
            cn(
              'px-2 py-1 text-gray-500 border-b-2 border-transparent whitespace-nowrap',
              isActive ? 'font-semibold text-primary border-primary' : ''
            )
          }
        >
          فایل قرارداد
        </NavLink>
      </div>

      <div className="mt-4">
        <Outlet />
      </div>
    </Page>
  )
}

export default PRContractViewPage
