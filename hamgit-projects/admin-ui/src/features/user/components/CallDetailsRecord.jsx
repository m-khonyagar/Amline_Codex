import { useState } from 'react'
import { handleErrorOnSubmit } from '@/utils/error'
import { toast } from '@/components/ui/Toaster'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useSendCallDetails } from '../api/call-details'
import { userCallStatusEnum, userCallTypeEnum } from '@/data/enums/user-enums'

export function CallDetailsRecord({ userId, onSuccess, onCanceled }) {
  const [description, setDescription] = useState('')
  const [callStatus, setCallStatus] = useState('GREEN')
  const [callType, setCallType] = useState('OUTGOING')
  const { mutate: sendCallDetails, isPending } = useSendCallDetails()

  const handleSendCall = async () => {
    sendCallDetails(
      { user_id: userId, description, type: callType, status: callStatus },
      {
        onSuccess: () => {
          setDescription('')
          setCallType('OUTGOING')
          setCallStatus('GREEN')
          toast.success('تماس با موفقیت ثبت شد')
          onSuccess?.()
        },
        onError: (error) => handleErrorOnSubmit(error),
      }
    )
  }

  return (
    <div>
      <Input
        multiline
        label="توضیحات تماس"
        placeholder="توضیحات تماس را وارد کنید"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isPending}
        floatError
      />

      <div className="flex items-start gap-5 mt-6">
        <Select
          asValue
          label="نوع تماس"
          value={callType}
          options={userCallTypeEnum}
          onChange={(value) => setCallType(value)}
          className="max-w-56"
        />

        <Select
          asValue
          label="وضعیت تماس"
          options={userCallStatusEnum}
          value={callStatus}
          onChange={(value) => setCallStatus(value)}
          className="max-w-64"
          renderOption={(option) => (
            <div className="flex items-center gap-2">
              <div className={`size-6 rounded-full ${option.color} border border-zinc-200`} />
              <span>{option.label}</span>
            </div>
          )}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="outline" onClick={onCanceled} disabled={isPending}>
          انصراف
        </Button>

        <Button
          size="sm"
          onClick={handleSendCall}
          loading={isPending}
          disabled={!description.trim().length}
        >
          ثبت
        </Button>
      </div>
    </div>
  )
}
