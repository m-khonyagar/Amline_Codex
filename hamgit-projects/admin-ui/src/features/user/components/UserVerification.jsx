import { CheckmarkIcon, CloseIcon } from '@/components/icons'
import Button from '@/components/ui/Button'
import { CheckboxField, DatePickerField, Form, InputField, useForm } from '@/components/ui/Form'
import { pickWithDefaults } from '@/utils/object'
import useVerifyUser from '../api/verify-user'
import { toast } from '@/components/ui/Toaster'
import { handleErrorOnSubmit } from '@/utils/error'

const UserVerification = ({ user, onCancel, onSuccess }) => {
  const methods = useForm({
    defaultValues: pickWithDefaults(user, {
      mobile: '',
      national_code: '',
      birth_date: '',
      without_verifying: false,
    }),
  })

  const withoutInquiry = methods.watch('without_verifying')

  const verifyUserMutation = useVerifyUser()

  const handleSubmit = (data, { setError }) => {
    if (data.without_verifying) {
      data.national_code = undefined
      data.birth_date = undefined
    }

    verifyUserMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success(`کاربر با موفقیت احراز شد`)
        onSuccess?.(res.data)
      },
      onError: (e) => {
        handleErrorOnSubmit(e, setError, data)
      },
    })
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit}>
      <InputField ltr isNumeric readOnly name="mobile" label="موبایل" />

      <InputField
        ltr
        isNumeric
        required={!withoutInquiry}
        disabled={withoutInquiry}
        name="national_code"
        label="کد ملی"
      />

      <DatePickerField
        required={!withoutInquiry}
        disabled={withoutInquiry}
        name="birth_date"
        label="تاریخ تولد"
      />

      <CheckboxField name="without_verifying" label="بدون استعلام" />

      <div className="text-left">
        {onCancel && (
          <Button
            size="sm"
            variant="gray"
            onClick={onCancel}
            disabled={verifyUserMutation.isPending}
          >
            <CloseIcon size={14} className="ml-1" /> انصراف
          </Button>
        )}
        <Button size="sm" type="submit" className="mr-2" loading={verifyUserMutation.isPending}>
          <CheckmarkIcon size={14} className="ml-1" />
          احراز هویت
        </Button>
      </div>
    </Form>
  )
}

export default UserVerification
