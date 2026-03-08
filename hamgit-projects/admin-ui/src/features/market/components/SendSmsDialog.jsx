import { useState } from 'react'
import { handleErrorOnSubmit } from '@/utils/error'
import { toast } from '@/components/ui/Toaster'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useSendSms } from '../api/send-sms-calls'

export function SendSmsDialog({ fileId, mobile, onSuccess, onCanceled }) {
  const [smsText, setSmsText] = useState('')
  const { mutate: sendSms, isPending } = useSendSms()

  const handleSendSms = async () => {
    sendSms(
      { file_id: fileId, mobile, text: smsText },
      {
        onSuccess: () => {
          setSmsText('')
          toast.success('پیامک با موفقیت ارسال شد')
          onSuccess?.()
        },
        onError: (error) => handleErrorOnSubmit(error),
      }
    )
  }

  return (
    <div className="space-y-4">
      <Input
        multiline
        label="متن پیامک"
        placeholder="متن پیامک را وارد کنید"
        value={smsText}
        onChange={(e) => setSmsText(e.target.value)}
        disabled={isPending}
      />

      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="outline" onClick={onCanceled} disabled={isPending}>
          انصراف
        </Button>

        <Button size="sm" onClick={handleSendSms} disabled={!smsText.trim()} loading={isPending}>
          ارسال
        </Button>
      </div>
    </div>
  )
}
