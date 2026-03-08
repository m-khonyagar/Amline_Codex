import { useState } from 'react'
import { ErrorPage, Page } from '@/features/misc'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { Badge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog/Dialog'
import { FileInfo } from '../components/FileInfo'
import { SendSmsDialog } from '../components/SendSmsDialog'
import { SendCallDialog } from '../components/SendCallDialog'
import { SendFileDialog } from '../components/SendFileDialog'
import {
  FileStatusOptions,
  MarketRole,
  MarketRoleLabels,
  MarketRoles,
} from '@/data/enums/market_enums'
import { translateEnum } from '@/utils/enum'
import { useGetLandlordFileInfo } from '../api/get-landlord-files'
import { useGetTenantFileInfo } from '../api/get-tenant-files'

export default function BuySellInfoPage() {
  const { role, id } = useParams()
  const navigate = useNavigate()
  const [isSmsDialogOpen, setIsSmsDialogOpen] = useState(false)
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false)
  const [isSendFileDialogOpen, setIsSendFileDialogOpen] = useState(false)
  // const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false)

  const isValidRole = MarketRoles.BUY_SELL.includes(role)
  const isValidId = Boolean(id)

  const getFileInfo = {
    [MarketRole.SELLER]: useGetLandlordFileInfo,
    [MarketRole.BUYER]: useGetTenantFileInfo,
  }[role]

  if (!isValidRole || !isValidId) return <ErrorPage returnUrl="/market/buy-sell" />

  const buySellQuery = getFileInfo(id)
  const data = buySellQuery.data

  return (
    <Page title={`فایل ${MarketRoleLabels[role]}`}>
      <LoadingAndRetry query={buySellQuery}>
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

          <div className="fa space-y-4 w-full max-w-sm">
            <div>
              <span className="font-bold">وضعیت فایل: </span>
              <Badge>{translateEnum(FileStatusOptions, data?.file_status)}</Badge>
            </div>

            <div>
              <span className="font-bold">توضیح وضعیت فایل: </span>
              {data?.description || ' - '}
            </div>

            <div>
              <span className="font-bold">تعداد فایل معرفی شده: </span>-
            </div>
          </div>

          <div className="fa space-y-4 w-full self-stretch max-w-sm ml-auto">
            <div>
              <span className="font-bold">برچسب ها: </span>
              <span>
                {data?.labels?.map((label) => (
                  <Badge variant="outline" key={label.id} className="m-0.5">
                    {label.title}
                  </Badge>
                )) || '--'}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-x-3.5">
              <Button
                className="basis-1/3"
                variant="outline"
                size="sm"
                onClick={() => setIsCallDialogOpen(true)}
              >
                تماس
              </Button>

              <Button
                className="basis-1/3"
                variant="outline"
                size="sm"
                onClick={() => setIsSmsDialogOpen(true)}
              >
                پیام
              </Button>

              <Button
                className="basis-1/3"
                variant="outline"
                size="sm"
                onClick={() => navigate(`/market/buy-sell/${role}/${id}/edit`)}
              >
                ویرایش
              </Button>
            </div>

            <div className="flex justify-end gap-x-3">
              <Button size="sm" onClick={() => setIsSendFileDialogOpen(true)}>
                ارسال فایل به مشاور املاک
              </Button>

              {/* {data?.amline_ad_id ? (
                <Button
                  size="sm"
                  target="_blank"
                  className="basis-1/2 fa"
                  href={
                    role === MarketRole.LANDLORD
                      ? '/ads/list/' + data?.amline_ad_id
                      : '/requirements/buy-and-rental/' + data?.amline_ad_id
                  }
                >
                  کد {role === MarketRole.LANDLORD ? 'آگهی' : 'نیازمندی'}: {data?.amline_ad_id}
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="basis-1/2"
                  onClick={() => setIsPublishDialogOpen(true)}
                >
                  ثبت {role === MarketRole.LANDLORD ? 'آگهی' : 'نیازمندی'} در املاین
                </Button>
              )} */}
            </div>
          </div>
        </div>

        <FileInfo data={{ ...data, role }} />
      </LoadingAndRetry>

      <Dialog open={isSmsDialogOpen} onOpenChange={setIsSmsDialogOpen} title="ارسال پیامک">
        <SendSmsDialog
          fileId={data?.id}
          mobile={data?.mobile}
          onSuccess={() => setIsSmsDialogOpen(false)}
          onCanceled={() => setIsSmsDialogOpen(false)}
        />
      </Dialog>

      <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen} title="ثبت تماس">
        <SendCallDialog
          fileId={data?.id}
          mobile={data?.mobile}
          onSuccess={() => setIsCallDialogOpen(false)}
          onCanceled={() => setIsCallDialogOpen(false)}
        />
      </Dialog>

      <Dialog
        closeOnBackdrop={false}
        open={isSendFileDialogOpen}
        onOpenChange={setIsSendFileDialogOpen}
        title="ارسال فایل به مشاور املاک"
        className="max-w-4xl"
      >
        <SendFileDialog file={{ ...data, role }} onSuccess={() => setIsSendFileDialogOpen(false)} />
      </Dialog>

      {/* <Dialog
        open={isPublishDialogOpen}
        onOpenChange={setIsPublishDialogOpen}
        title={`ثبت ${role === MarketRole.LANDLORD ? 'آگهی' : 'نیازمندی'} در املاین`}
      >
        <PublishAdDialog
          id={id}
          role={role}
          onSuccess={() => setIsPublishDialogOpen(false)}
          onCancel={() => setIsPublishDialogOpen(false)}
        />
      </Dialog> */}
    </Page>
  )
}
