import { CloseIcon, DocumentEditIcon } from '@/components/icons'
import Button from '@/components/ui/Button'
import { DatePickerField, Form, InputField, useForm } from '@/components/ui/Form'
import { pickWithDefaults } from '@/utils/object'
import useUpdatePRContractParty from '../../api/update-pr-contract-party'
import { toast } from '@/components/ui/Toaster'
import { handleErrorOnSubmit } from '@/utils/error'

const PRContractEditParty = ({ party, onCancel, onSuccess }) => {
  const methods = useForm({
    defaultValues: pickWithDefaults(party, {
      first_name: '',
      last_name: '',
      father_name: '',
      national_code: '',
      address: '',
      postal_code: '',
      birth_date: '',
    }),
  })

  const updatePRContractPartyMutation = useUpdatePRContractParty(party.contract.id, party.id)

  const handleSubmit = (data, { setError }) => {
    updatePRContractPartyMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success('قرارداد با موفقیت ویرایش شد')

        onSuccess(res)
      },
      onError: (e) => {
        handleErrorOnSubmit(e, setError, data)
      },
    })
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit}>
      <InputField name="first_name" label="نام" />

      <InputField name="last_name" label="نام خانوادگی" />

      <InputField name="father_name" label="نام پدر" />

      <InputField ltr isNumeric name="national_code" label="کد ملی" />

      <DatePickerField name="birth_date" label="تاریخ تولد" />

      <InputField ltr isNumeric type="tel" name="postal_code" label="کد پستی" />

      <InputField name="address" label="آدرس" multiline />

      <div className="text-left">
        <Button
          size="sm"
          variant="gray"
          onClick={onCancel}
          disabled={updatePRContractPartyMutation.isPending}
        >
          <CloseIcon size={14} className="ml-1" /> انصراف
        </Button>
        <Button
          size="sm"
          type="submit"
          className="mr-2"
          loading={updatePRContractPartyMutation.isPending}
        >
          <DocumentEditIcon size={14} className="ml-1" /> ثبت
        </Button>
      </div>
    </Form>
  )
}

export default PRContractEditParty
