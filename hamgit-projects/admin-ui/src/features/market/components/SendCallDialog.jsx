import { useState } from 'react'
import { handleErrorOnSubmit } from '@/utils/error'
import { toast } from '@/components/ui/Toaster'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useSendFileCall } from '../api/send-sms-calls'
import { PhoneIcon } from '@/components/icons'
import Select from '@/components/ui/Select'
import { CallStatusEnum, CallStatusOptions } from '@/data/enums/market_enums'

export function SendCallDialog({ fileId, mobile, onSuccess, onCanceled }) {
  const [description, setDescription] = useState('')
  const [callStatus, setCallStatus] = useState(CallStatusEnum.SUCCESS)
  const { mutate: sendFileCall, isPending } = useSendFileCall()

  const handleSendCall = async () => {
    sendFileCall(
      { file_id: fileId, mobile, description, status: callStatus },
      {
        onSuccess: () => {
          setDescription('')
          toast.success('تماس با موفقیت ثبت شد')
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
        label="توضیحات تماس"
        placeholder="توضیحات تماس را وارد کنید"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isPending}
        floatError
      />
      <Select
        asValue
        label="وضعیت تماس"
        options={CallStatusOptions}
        value={callStatus}
        onChange={(value) => setCallStatus(value)}
        className="max-w-60"
      />
      <div className="flex gap-2 justify-end">
        <Button
          href={`tel:${mobile}`}
          className="ml-auto gap-2"
          rel="noopener noreferrer"
          size="sm"
          variant="gray"
        >
          تماس
          <PhoneIcon size={18} />
        </Button>

        <Button size="sm" variant="outline" onClick={onCanceled} disabled={isPending}>
          انصراف
        </Button>

        <Button size="sm" onClick={handleSendCall} loading={isPending}>
          ثبت
        </Button>
      </div>
    </div>
  )
}
