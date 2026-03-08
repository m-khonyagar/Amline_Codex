import { useNavigate } from 'react-router-dom'
import { Page } from '@/features/misc'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import SinglePromoCodeForm from '../components/SinglePromoCodeForm'
import BulkPromoCodesForm from '../components/BulkPromoCodesForm'

const PromoCodesPage = () => {
  const navigate = useNavigate()

  const handleSuccess = () => navigate('/promo-codes')

  return (
    <Page title="ایجاد کد تخفیف">
      <div className="bg-white rounded-lg p-4 w-full max-w-5xl mx-auto">
        <Tabs dir="rtl" defaultValue="single">
          <TabsList className="mb-4">
            <TabsTrigger value="single">ایجاد تکی</TabsTrigger>
            <TabsTrigger value="bulk">ایجاد گروهی</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <SinglePromoCodeForm onSuccess={handleSuccess} onCancel={handleSuccess} />
          </TabsContent>

          <TabsContent value="bulk">
            <BulkPromoCodesForm onSuccess={handleSuccess} onCancel={handleSuccess} />
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  )
}

export default PromoCodesPage
