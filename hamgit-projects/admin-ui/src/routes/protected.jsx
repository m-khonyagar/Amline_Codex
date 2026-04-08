import AppLayout from '@/layouts/app'
import { useAuthContext } from '@/features/auth'
import { userRoutes } from '@/features/user'
import { walletRoutes } from '@/features/wallet'
import { contractRoutes } from '@/features/contract'
import { dashboardRoutes } from '@/features/dashboard'
import { settlementRoutes } from '@/features/settlement'
import { customInvoiceRoutes } from '@/features/custom-invoice'
import { adsRoutes } from '@/features/ads'
import { requirementsRoutes } from '@/features/requirement'
import { clausesRoutes } from '@/features/clauses'
import { marketRoutes } from '@/features/market'
import { promoCodesRoutes } from '@/features/promo-codes'

function ProtectedRoutes() {
  const { isLoggedIn } = useAuthContext()
  return isLoggedIn && <AppLayout />
}

const protectedRoutes = [
  {
    path: '/',
    element: <ProtectedRoutes />,
    children: [
      ...dashboardRoutes,
      ...userRoutes,
      ...contractRoutes,
      ...customInvoiceRoutes,
      ...settlementRoutes,
      ...walletRoutes,
      ...adsRoutes,
      ...requirementsRoutes,
      ...clausesRoutes,
      ...marketRoutes,
      ...promoCodesRoutes,
    ],
    // errorElement: <ErrorPage />,
  },
]

export default protectedRoutes
