import { useNavigate, useParams } from 'react-router-dom'
import { ErrorPage, Page } from '@/features/misc'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { MarketRoles } from '@/data/enums/market_enums'
import { BuyerFilesList } from '../components/buy-sell/BuyerFilesList'
import { SellerFilesList } from '../components/buy-sell/SellerFilesList'

export default function BuySellArchivePage() {
  const { role } = useParams()
  const navigate = useNavigate()

  const isValidRole = MarketRoles.BUY_SELL.includes(role)
  if (!isValidRole) return <ErrorPage returnUrl="/market/buy-sell" />

  return (
    <Page title="لیست فایل‌های بایگانی شده">
      <Tabs dir="rtl" value="archive" onValueChange={(e) => navigate(`/market/buy-sell/${e}`)}>
        <TabsList>
          <TabsTrigger value="buyer">فایل خریدار</TabsTrigger>
          <TabsTrigger value="seller">فایل فروشنده</TabsTrigger>
          <TabsTrigger value="archive">بایگانی</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6 bg-white rounded-2xl">
        <Tabs
          dir="rtl"
          value={role}
          onValueChange={(e) => navigate(`/market/buy-sell/${e}/archive`)}
        >
          <TabsList className="px-4 pt-5">
            <TabsTrigger value="buyer">بایگانی فایل خریدار</TabsTrigger>
            <TabsTrigger value="seller">بایگانی فایل فروشنده</TabsTrigger>
          </TabsList>

          <TabsContent value="buyer" className="mt-4">
            <BuyerFilesList className="border-none" isArchive />
          </TabsContent>

          <TabsContent value="seller" className="mt-4">
            <SellerFilesList className="border-none" isArchive />
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  )
}
