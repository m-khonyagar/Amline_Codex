import { useState } from 'react'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { FileStatusEnum, FileStatusLabels, FileStatusOptions } from '@/data/enums/market_enums'
import { useUpdateTenantFiles } from '../../../api/update-tenant-files'
import { toast } from '@/components/ui/Toaster'

export const BuyerFilesListRestore = ({ file, onCancel, onSuccess }) => {
  const [status, setStatus] = useState('')

  const updateTenantFiles = useUpdateTenantFiles(file?.id, { enabled: !!file?.id })

  const handleRestore = () => {
    if (!status) {
      toast.error('وضعیت جدید را انتخاب کنید')
      return
    }

    updateTenantFiles.mutate(
      {
        listing_type: 'SALE',
        file_status: status,
        mobile: file?.mobile,
      },
      {
        onSuccess: () => {
          toast.success('وضعیت فایل با موفقیت به روز شد')
          onSuccess?.()
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-zinc-900 text-base font-medium">
        برای بازیابی و تغییر وضعیت بایگانی، ابتدا وضعیت جدیدی برای فایل انتخاب کنید
      </p>

      <div className="p-2.5 bg-gray-100 rounded-lg">
        <span className="text-gray-500 font-medium">وضعیت فعلی:</span>{' '}
        <span className="text-zinc-900 font-medium">
          {FileStatusLabels[file?.file_status || FileStatusEnum.ARCHIVED]}
        </span>
      </div>

      <Select
        asValue
        label="وضعیت جدید"
        options={FileStatusOptions}
        value={status}
        onChange={setStatus}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="gray" size="sm" onClick={onCancel} disabled={updateTenantFiles.isPending}>
          انصراف
        </Button>

        <Button size="sm" onClick={handleRestore} loading={updateTenantFiles.isPending}>
          ثبت
        </Button>
      </div>
    </div>
  )
}
