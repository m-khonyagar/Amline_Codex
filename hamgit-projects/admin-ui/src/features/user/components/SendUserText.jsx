import Button from '@/components/ui/Button'
import { Form, InputField, SelectField, useForm } from '@/components/ui/Form'
import { toast } from '@/components/ui/Toaster'
import { useSendUserText } from '../../user/api/send-user-text'

const SendUserText = ({ userId, onSuccess, onCanceled }) => {
  const methods = useForm({
    defaultValues: {
      sender: 'SMS',
      text: '',
    },
  })

  const sendUserTextMutation = useSendUserText()
  const textValue = methods.watch('text')

  const handleSubmit = (data) => {
    const payload = {
      user_id: userId,
      text: data.text,
      sender: data.sender,
    }

    sendUserTextMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('پیام با موفقیت ارسال شد')
        onSuccess?.()
      },
      onError: () => {
        toast.error('ارسال پیام ناموفق بود')
      },
    })
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit} className="space-y-1">
      <SelectField
        asValue
        label="فرستنده"
        name="sender"
        options={[
          { label: 'اس ام اس', value: 'SMS' },
          { label: 'دینگ', value: 'DING' },
        ]}
      />

      <InputField label="متن" name="text" multiline required />

      <div className="text-left">
        <Button
          size="sm"
          variant="gray"
          onClick={onCanceled}
          type="button"
          disabled={sendUserTextMutation.isPending}
        >
          انصراف
        </Button>

        <Button
          size="sm"
          type="submit"
          className="mr-2"
          loading={sendUserTextMutation.isPending}
          disabled={!String(textValue || '').trim().length}
        >
          ارسال
        </Button>
      </div>
    </Form>
  )
}

export default SendUserText
