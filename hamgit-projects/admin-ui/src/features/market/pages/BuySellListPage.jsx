import { useNavigate, useParams } from 'react-router-dom'
import { ErrorPage, Page } from '@/features/misc'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { BuyerFilesList } from '../components/buy-sell/BuyerFilesList'
import { SellerFilesList } from '../components/buy-sell/SellerFilesList'
import { MarketRoles } from '@/data/enums/market_enums'

const BuySellListPage = () => {
  const { role } = useParams()
  const navigate = useNavigate()

  const isValidRole = MarketRoles.BUY_SELL.includes(role)
  if (!isValidRole) return <ErrorPage returnUrl="/market/buy-sell" />

  return (
    <Page title="لیست فایل‌های خرید و فروش">
      <Tabs dir="rtl" value={role} onValueChange={(e) => navigate(`/market/buy-sell/${e}`)}>
        <TabsList>
          <TabsTrigger value="buyer">فایل خریدار</TabsTrigger>
          <TabsTrigger value="seller">فایل فروشنده</TabsTrigger>
          <TabsTrigger value={`${role}/archive`}>بایگانی</TabsTrigger>
        </TabsList>

        <TabsContent value="buyer" className="mt-6">
          <BuyerFilesList />
        </TabsContent>

        <TabsContent value="seller" className="mt-6">
          <SellerFilesList />
        </TabsContent>
      </Tabs>
    </Page>
  )
}

export default BuySellListPage
