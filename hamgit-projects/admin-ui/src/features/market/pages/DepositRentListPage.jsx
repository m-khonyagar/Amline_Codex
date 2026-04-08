import { useNavigate, useParams } from 'react-router-dom'
import { ErrorPage, Page } from '@/features/misc'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { LandlordFilesList } from '../components/deposit-rent/LandlordFilesList'
import { TenantFilesList } from '../components/deposit-rent/TenantFilesList'
import { MarketRoles } from '@/data/enums/market_enums'

const DepositRentListPage = () => {
  const { role } = useParams()
  const navigate = useNavigate()

  const isValidRole = MarketRoles.DEPOSIT_RENT.includes(role)
  if (!isValidRole) return <ErrorPage returnUrl="/market/deposit-rent" />

  return (
    <Page title="لیست فایل‌های رهن و اجاره">
      <Tabs dir="rtl" value={role} onValueChange={(e) => navigate(`/market/deposit-rent/${e}`)}>
        <TabsList>
          <TabsTrigger value="landlord">فایل اجاره مالک</TabsTrigger>
          <TabsTrigger value="tenant">فایل اجاره مستاجر</TabsTrigger>
          <TabsTrigger value={`${role}/archive`}>بایگانی</TabsTrigger>
        </TabsList>

        <TabsContent value="landlord" className="mt-6">
          <LandlordFilesList />
        </TabsContent>

        <TabsContent value="tenant" className="mt-6">
          <TenantFilesList />
        </TabsContent>
      </Tabs>
    </Page>
  )
}

export default DepositRentListPage
