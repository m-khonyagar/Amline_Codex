import { useState } from 'react'
import { useGetTitleAi } from '../api/get-title-ai'
import { usePublishLandlordFile } from '../api/publish-landlord-files'
import { usePublishTenantFile } from '../api/publish-tenant-files'
import { handleErrorOnSubmit } from '@/utils/error'
import { MarketRole } from '@/data/enums/market_enums'
import { toast } from '@/components/ui/Toaster'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export const PublishAdDialog = ({ id, role, onSuccess, onCancel }) => {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const adTypeLabel = {
    [MarketRole.LANDLORD]: 'آگهی',
    [MarketRole.TENANT]: 'نیازمندی',
  }[role]

  const getTitleAiMutation = useGetTitleAi(id, {
    onSuccess: ({ data: title }) => {
      if (title) {
        setTitle(title.replace(/^"|"$/g, ''))
        toast.success(`عنوان ${adTypeLabel} با هوش مصنوعی تولید شد`)
      } else toast.error('خطا در تولید عنوان')
    },
    onError: handleErrorOnSubmit,
  })

  const handleGenerateAiTitle = () => {
    if (getTitleAiMutation.isPending) return
    setError('')
    getTitleAiMutation.mutate()
  }

  const publishMutation = {
    [MarketRole.LANDLORD]: usePublishLandlordFile({
      onSuccess: () => {
        toast.success(`ثبت ${adTypeLabel} با موفقیت انجام شد`)
        onSuccess?.()
      },
      onError: handleErrorOnSubmit,
    }),
    [MarketRole.TENANT]: usePublishTenantFile({
      onSuccess: () => {
        toast.success(`ثبت ${adTypeLabel} با موفقیت انجام شد`)
        onSuccess?.()
      },
      onError: handleErrorOnSubmit,
    }),
  }[role]

  const handlePublish = () => {
    if (!title.trim()) {
      setError(`لطفاً عنوان ${adTypeLabel} را وارد کنید`)
      return
    }
    setError('')
    if (publishMutation && typeof publishMutation.mutate === 'function') {
      console.log(id)
      publishMutation.mutate({ id, title: title.trim() })
    }
  }

  return (
    <div className="space-y-2">
      <div>
        <Input
          label={`عنوان ${adTypeLabel}`}
          placeholder={`عنوان ${adTypeLabel} را وارد کنید`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error}
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleGenerateAiTitle}
        loading={getTitleAiMutation.isPending}
      >
        تولید عنوان با هوش مصنوعی
      </Button>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={publishMutation.isPending}>
          انصراف
        </Button>

        <Button size="sm" onClick={handlePublish} loading={publishMutation.isPending}>
          ثبت {adTypeLabel}
        </Button>
      </div>
    </div>
  )
}
