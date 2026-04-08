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

const DepositRentUpdatePage = () => {
  const { role, id } = useParams()

  const isValidRole = MarketRoles.DEPOSIT_RENT.includes(role)
  const isValidId = Boolean(id)

  if (!isValidRole || !isValidId) return <ErrorPage returnUrl="/market/deposit-rent" />

  return (
    <Page title={`ویرایش فایل - ${MarketRoleLabels[role]}`}>
      {role === MarketRole.LANDLORD ? (
        <Suspense fallback={<div>در حال بارگذاری...</div>}>
          <DepositRentLandlordForm id={id} />
        </Suspense>
      ) : (
        <Suspense fallback={<div>در حال بارگذاری...</div>}>
          <DepositRentTenantForm id={id} />
        </Suspense>
      )}
    </Page>
  )
}

export default DepositRentUpdatePage
