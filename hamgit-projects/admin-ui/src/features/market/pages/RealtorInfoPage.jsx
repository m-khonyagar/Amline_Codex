import { useState } from 'react'
import { Page } from '@/features/misc'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { Badge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog/Dialog'
import { useGetRealtorFileInfo } from '../api/get-realtor-files'
import { RealtorInfo } from '../components/RealtorInfo'
import { FileStatusOptions } from '@/data/enums/market_enums'
import { translateEnum } from '@/utils/enum'
import { SendSmsDialog } from '../components/SendSmsDialog'
import { SendCallDialog } from '../components/SendCallDialog'

export default function RealtorInfoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [smsOpen, setSmsOpen] = useState(false)
  const [callOpen, setCallOpen] = useState(false)

  const isValidId = Boolean(id)

  const realtorFileQuery = useGetRealtorFileInfo(id)
  const data = realtorFileQuery.data

  if (!isValidId) {
    return (
      <Page title="خطا">
        <div className="flex items-center flex-col py-20 justify-center">
          <div className="text-red-600 font-bold text-center max-w-lg mb-6">
            در انجام درخواست شما مشکلی به وجود آمده است. لطفاً دوباره تلاش کنید و در صورت تداوم
            مشکل، با تیم فنی تماس بگیرید.
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              تلاش مجدد
            </Button>

            <Button variant="danger" size="sm" href="/market">
              بازگشت
            </Button>
          </div>
        </div>
      </Page>
    )
  }

  return (
    <Page title={`فایل مشاور ${id}`}>
      <LoadingAndRetry query={realtorFileQuery}>
        <div className="bg-white shadow-md p-4 gap-y-10 rounded-lg flex flex-wrap items-center mb-6">
          <div className="fa space-y-4 w-full max-w-sm">
            <div>
              <span className="font-bold">شناسه فایل: </span>
              {data?.id}
            </div>

            <div>
              <span className="font-bold">منبع فایل: </span>
              {data?.file_source?.title}
            </div>

            <div>
              <span className="font-bold">کارشناس فایل: </span>
              {data?.assigned_to_user?.fullname || ' - '}
            </div>
          </div>

          <div className="fa space-y-4 w-full max-w-sm ml-auto">
            <div>
              <span className="font-bold">وضعیت فایل: </span>
              <Badge>{translateEnum(FileStatusOptions, data?.file_status)}</Badge>
            </div>

            <div>
              <span className="font-bold">توضیح وضعیت فایل: </span>
              {data?.description || ' - '}
            </div>
          </div>

          <div className="grid gap-y-2.5 gap-x-3 grid-cols-2">
            <Button size="sm" onClick={() => setSmsOpen(true)}>
              پیام
            </Button>

            <Button variant="outline" size="sm" onClick={() => setCallOpen(true)}>
              تماس
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/market/realtor/${id}/edit`)}
            >
              ویرایش
            </Button>
          </div>
        </div>

        <RealtorInfo data={data} />
      </LoadingAndRetry>

      <Dialog open={smsOpen} onOpenChange={setSmsOpen} title="ارسال پیامک">
        <SendSmsDialog
          fileId={data?.id}
          mobile={data?.mobile}
          onSuccess={() => setSmsOpen(false)}
          onCanceled={() => setSmsOpen(false)}
        />
      </Dialog>

      <Dialog open={callOpen} onOpenChange={setCallOpen} title="ثبت تماس">
        <SendCallDialog
          fileId={data?.id}
          mobile={data?.mobile}
          onSuccess={() => setCallOpen(false)}
          onCanceled={() => setCallOpen(false)}
        />
      </Dialog>
    </Page>
  )
}
