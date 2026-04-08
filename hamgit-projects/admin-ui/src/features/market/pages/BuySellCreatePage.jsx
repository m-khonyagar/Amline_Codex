import { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorPage, Page } from '@/features/misc'
import { MarketRole, MarketRoleLabels, MarketRoles } from '@/data/enums/market_enums'

const BuySellBuyerForm = lazy(() =>
  import('../components/buy-sell/BuySellBuyerForm').then((module) => ({
    default: module.BuySellBuyerForm,
  }))
)

const BuySellSellerForm = lazy(() =>
  import('../components/buy-sell/BuySellSellerForm').then((module) => ({
    default: module.BuySellSellerForm,
  }))
)

export default function BuySellCreatePage() {
  const { role } = useParams()

  const isValidRole = MarketRoles.BUY_SELL.includes(role)
  if (!isValidRole) return <ErrorPage returnUrl="/market/buy-sell" />

  return (
    <Page title={`ایجاد فایل ${MarketRoleLabels[role]}`}>
      {role === MarketRole.BUYER ? (
        <Suspense fallback={<div>در حال بارگذاری...</div>}>
          <BuySellBuyerForm />
        </Suspense>
      ) : (
        <Suspense fallback={<div>در حال بارگذاری...</div>}>
          <BuySellSellerForm />
        </Suspense>
      )}
    </Page>
  )
}
