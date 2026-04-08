import { toast } from '@/components/ui/Toaster'
import { handleErrorOnSubmit } from '@/utils/error'
import { cn } from '@/utils/dom'
import Button from '@/components/ui/Button'
import { CloseIcon } from '@/components/icons'
import Input from '@/components/ui/Input'
import { useRef, useState } from 'react'
import { useWalletBulkManualCharge } from '../api/manual-charge'

const replacements = {
  '{amount}': 'مبلغ شارژ شده',
  '{credit}': 'موجودی کیف پول',
}

const WalletBulkManualCharge = ({ className, onCancel, onSuccess }) => {
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)

  const bulkManualChargeMutation = useWalletBulkManualCharge()

  const handleSubmit = () => {
    if (!file) {
      toast.error('لطفا یک فایل اکسل انتخاب کنید.')
      return
    }

    const formData = new FormData()
    formData.set('file', file)
    if (message) formData.set('text_message', message)

    bulkManualChargeMutation.mutate(formData, {
      onSuccess: (res) => {
        toast.success('عملیات با موفقیت انجام شد.')
        setMessage('')
        setFile(null)
        onSuccess?.(res)
      },
      onError: handleErrorOnSubmit,
    })
  }

  const handleFileChange = () => {
    if (fileInputRef.current?.files?.length > 0) {
      setFile(fileInputRef.current.files[0])
    }
  }

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.info(`"${text}" کپی شد`)
  }

  return (
    <div className={cn(className)}>
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold">افزایش اعتبار گروهی</h3>

        <div className="w-full">
          <Input
            type="file"
            label="فایل اکسل:"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls"
          />
        </div>

        <Input
          name="text_message"
          label="متن پیام"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
        />

        <div className="text-sm text-gray-700">
          <p className="font-semibold mb-2">علائم قابل استفاده:</p>
          <ul className="flex items-center flex-wrap gap-x-6 gap-y-1">
            {Object.entries(replacements).map(([key, description]) => (
              <li
                key={key}
                className="cursor-pointer text-blue-500 hover:underline"
                onClick={() => handleCopyToClipboard(key)}
              >
                {key}: {description}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 text-left">
          {onCancel && (
            <Button
              size="sm"
              variant="gray"
              onClick={onCancel}
              disabled={bulkManualChargeMutation.isPending}
            >
              <CloseIcon size={14} className="ml-1" /> انصراف
            </Button>
          )}

          <Button
            size="sm"
            type="button"
            onClick={handleSubmit}
            className="mr-2"
            loading={bulkManualChargeMutation.isPending}
          >
            ارسال
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WalletBulkManualCharge
