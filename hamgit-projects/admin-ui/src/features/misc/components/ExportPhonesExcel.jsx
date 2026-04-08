import { useState } from 'react'
import { format } from 'date-fns'
import { downloadBlob } from '@/utils/file'
import { PhoneExportTypeEnum } from '@/data/enums/market_enums'
import { useDownloadPhonesExcel } from '../api/export'
import Button from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import DatePicker from '@/components/ui/DatePicker'
import { ExportSheetIcon } from '@/components/icons'

export default function ExportPhonesExcel({ type = PhoneExportTypeEnum.USER }) {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [payload, setPayload] = useState({
    entity_types: [type],
    start_date: undefined,
    end_date: undefined,
  })

  const downloadPhonesExcelMutation = useDownloadPhonesExcel()

  const handleExport = () => {
    downloadPhonesExcelMutation.mutate(payload, {
      onSuccess: (data) => {
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        const filename = 'phones.xlsx'
        downloadBlob(blob, filename)
      },
    })
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setIsExportDialogOpen(true)}>
        خروجی اکسل
        <ExportSheetIcon className="mr-2" />
      </Button>

      <Dialog
        className="max-w-md"
        title="خروجی اکسل"
        open={isExportDialogOpen}
        onOpenChange={(s) => {
          setIsExportDialogOpen(s)
          setPayload((prev) => ({
            ...prev,
            start_date: undefined,
            end_date: undefined,
          }))
        }}
      >
        <div className="px-4 py-2 bg-[#F6FBFB]">
          <p className="text-gray-500 text-sm">
            بازه زمانی رو انتخاب کن، بعد روی دکمه «ایجاد فایل اکسل» بزن. آماده شدن فایل زمان می‌بره؛
            لطفاً تا اتمام فرآیند صبر کن. به محض آماده شدن، فایل به طور خودکار دانلود می‌شه.
          </p>
        </div>

        <div className="flex items-end gap-3">
          <DatePicker
            label="تاریخ ایجاد"
            format="YYYY/MM/DD"
            placeholder="از تاریخ"
            value={payload.start_date}
            onChange={(d) => setPayload((prev) => ({ ...prev, start_date: d }))}
          />
          <DatePicker
            format="YYYY/MM/DD"
            placeholder="تا تاریخ"
            value={payload.end_date}
            onChange={(d) => setPayload((prev) => ({ ...prev, end_date: d }))}
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button
            size="sm"
            onClick={handleExport}
            loading={downloadPhonesExcelMutation.isPending}
            disabled={
              payload.start_date &&
              payload.end_date &&
              (payload.end_date < payload.start_date ||
                payload.end_date > format(new Date(), 'yyyy-MM-dd'))
            }
          >
            ایجاد فایل اکسل
          </Button>
        </div>
      </Dialog>
    </>
  )
}
