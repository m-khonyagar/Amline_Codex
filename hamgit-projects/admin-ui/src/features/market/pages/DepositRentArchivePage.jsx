import { useNavigate, useParams } from 'react-router-dom'
import { ErrorPage, Page } from '@/features/misc'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { MarketRoles } from '@/data/enums/market_enums'
import { LandlordFilesList } from '../components/deposit-rent/LandlordFilesList'
import { TenantFilesList } from '../components/deposit-rent/TenantFilesList'

export default function DepositRentArchivePage() {
  const { role } = useParams()
  const navigate = useNavigate()

  const isValidRole = MarketRoles.DEPOSIT_RENT.includes(role)
  if (!isValidRole) return <ErrorPage returnUrl="/market/deposit-rent" />

  return (
    <Page title="لیست فایل‌های بایگانی شده">
      <Tabs dir="rtl" value="archive" onValueChange={(e) => navigate(`/market/deposit-rent/${e}`)}>
        <TabsList>
          <TabsTrigger value="landlord">فایل اجاره مالک</TabsTrigger>
          <TabsTrigger value="tenant">فایل اجاره مستاجر</TabsTrigger>
          <TabsTrigger value="archive">بایگانی</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6 bg-white rounded-2xl">
        <Tabs
          dir="rtl"
          value={role}
          onValueChange={(e) => navigate(`/market/deposit-rent/${e}/archive`)}
        >
          <TabsList className="px-4 pt-5">
            <TabsTrigger value="landlord">بایگانی فایل مالک</TabsTrigger>
            <TabsTrigger value="tenant">بایگانی فایل مستاجر</TabsTrigger>
          </TabsList>

          <TabsContent value="landlord" className="mt-4">
            <LandlordFilesList className="border-none" isArchive />
          </TabsContent>

          <TabsContent value="tenant" className="mt-4">
            <TenantFilesList className="border-none" isArchive />
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  )
}
