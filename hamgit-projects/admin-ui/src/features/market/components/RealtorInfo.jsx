import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { userGenderTranslation } from '@/data/enums/user-enums'
import { History } from './History'

export const RealtorInfo = ({ data }) => (
  <div className="bg-white rounded-lg">
    <Tabs defaultValue="file_info" dir="rtl">
      <TabsList className="pt-2">
        <TabsTrigger value="file_info" className="text-base">
          اطلاعات مشاور املاک
        </TabsTrigger>
        <TabsTrigger value="history" className="text-base">
          تاریخچه
        </TabsTrigger>
      </TabsList>

      <TabsContent value="file_info" className="py-8">
        <div className="grid lg:grid-cols-2 gap-y-24">
          <div className="space-y-4 px-6 lg:border-l border-black/20">
            <p className="flex items-center justify-between gap-8">
              <span className="text-nowrap">شماره تلفن: </span>
              <span className="fa text-left">{data?.mobile || '--'}</span>
            </p>
            <p className="flex items-center justify-between gap-8">
              <span className="text-nowrap">نام و نام خانوادگی: </span>
              <span className="text-left">{data?.full_name || '--'}</span>
            </p>
            <p className="flex items-center justify-between gap-8">
              <span>جنسیت: </span>
              <span className="text-left">{userGenderTranslation[data?.gender] || '--'}</span>
            </p>
            <p className="flex items-center justify-between gap-8">
              <span className="text-nowrap">نام املاک: </span>
              <span className="text-left">{data?.office_name || '--'}</span>
            </p>
            <p className="flex items-center justify-between gap-8">
              <span className="text-nowrap">آدرس دفتر یا املاک: </span>
              <span className="text-left">{data?.office_address || '--'}</span>
            </p>
          </div>

          <div className="space-y-4 px-6">
            <p className="flex items-center justify-between gap-8">
              <span className="text-nowrap">تاریخ ایجاد: </span>
              <span className="text-left">
                {data?.created_at ? new Date(data.created_at).toLocaleDateString('fa-IR') : '--'}
              </span>
            </p>
            <p className="flex items-center justify-between gap-8">
              <span className="text-nowrap">شهر: </span>
              <span className="text-left">
                {data?.city ? `${data?.city?.province} - ${data?.city?.name}` : '--'}
              </span>
            </p>
            <p className="flex items-center justify-between gap-8">
              <span className="text-nowrap">محله: </span>
              <span className="text-left">
                {data?.districts?.map((i) => i.name).join(' - ') || '--'}
              </span>
            </p>
            <p className="flex items-center justify-between gap-8">
              <span className="text-nowrap">منطقه: </span>
              <span className="text-left fa">{data?.regions?.join(' - ') || '--'}</span>
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="history" className="p-6">
        <History fileId={data.id} />
      </TabsContent>
    </Tabs>
  </div>
)
