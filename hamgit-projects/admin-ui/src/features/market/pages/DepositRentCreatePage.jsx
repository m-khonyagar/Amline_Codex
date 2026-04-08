import { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorPage, Page } from '@/features/misc'
import { MarketRole, MarketRoleLabels, MarketRoles } from '@/data/enums/market_enums'

const DepositRentLandlordForm = lazy(() =>
  import('../components/deposit-rent/DepositRentLandlordForm').then((module) => ({
    default: module.DepositRentLandlordForm,
  }))
)

const DepositRentTenantForm = lazy(() =>
  import('../components/deposit-rent/DepositRentTenantForm').then((module) => ({
    default: module.DepositRentTenantForm,
  }))
)

export default function DepositRentCreatePage() {
  const { role } = useParams()

  const isValidRole = MarketRoles.DEPOSIT_RENT.includes(role)
  if (!isValidRole) return <ErrorPage returnUrl="/market/deposit-rent" />

  return (
    <Page title={`ایجاد فایل ${MarketRoleLabels[role]}`}>
      {role === MarketRole.LANDLORD ? (
        <Suspense fallback={<div>در حال بارگذاری...</div>}>
          <DepositRentLandlordForm />
        </Suspense>
      ) : (
        <Suspense fallback={<div>در حال بارگذاری...</div>}>
          <DepositRentTenantForm />
        </Suspense>
      )}
    </Page>
  )
}
