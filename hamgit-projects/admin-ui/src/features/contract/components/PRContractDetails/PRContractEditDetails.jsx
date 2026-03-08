import { CloseIcon, DocumentEditIcon } from '@/components/icons'
import Button from '@/components/ui/Button'
import { DatePickerField, Form, InputNumberField, useForm } from '@/components/ui/Form'
import { pickWithDefaults } from '@/utils/object'
import useUpdatePRContractDetails from '../../api/update-pr-contract-details'
import { handleErrorOnSubmit } from '@/utils/error'
import { toast } from '@/components/ui/Toaster'

const PRContractEditDetails = ({ prContract, onCancel, onSuccess }) => {
  const methods = useForm({
    defaultValues: pickWithDefaults(prContract, {
      date: { path: 'contract.date', default: '' },
      start_date: '',
      end_date: '',
      property_handover_date: '',
      landlord_penalty_fee: '',
      tenant_penalty_fee: '',
      tenant_family_members_count: '',
    }),
  })

  const patchPRContractDetailsMutation = useUpdatePRContractDetails(prContract.contract.id)

  const handleSubmit = (data, { setError }) => {
    patchPRContractDetailsMutation.mutate(data, {
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
      <div className="bg-white rounded-lg py-2 flex flex-wrap">
        <div className="md:basis-1/2 py-2 px-4 flex-grow flex flex-col gap-4 md:border-l">
          <DatePickerField
            required
            label="تاریخ عقد قرارداد"
            placeholder="انتخاب کنید"
            name="date"
          />

          <DatePickerField
            required
            label="تاریخ شروع"
            placeholder="انتخاب کنید"
            name="start_date"
          />

          <DatePickerField required label="تاریخ پایان" placeholder="انتخاب کنید" name="end_date" />

          <DatePickerField
            required
            label="تاریخ تحویل ملک"
            placeholder="انتخاب کنید"
            name="property_handover_date"
          />
        </div>

        <div className="md:basis-1/2 py-2 px-4 flex-grow flex flex-col gap-4">
          <InputNumberField
            required
            suffix="تومان"
            decimalSeparator="/"
            placeholder="2,000,000"
            name="tenant_penalty_fee"
            label="وجه التزام از مستاجر"
          />

          <InputNumberField
            required
            suffix="تومان"
            decimalSeparator="/"
            placeholder="2,000,000"
            name="landlord_penalty_fee"
            label="وجه التزام از موجر"
          />

          <InputNumberField
            required
            placeholder="3"
            label="تعداد مستاجران"
            name="tenant_family_members_count"
          />
        </div>
      </div>

      <div className="p-4 text-left">
        <Button
          size="sm"
          variant="gray"
          onClick={onCancel}
          disabled={patchPRContractDetailsMutation.isPending}
        >
          <CloseIcon size={14} className="ml-1" /> انصراف
        </Button>
        <Button
          size="sm"
          type="submit"
          className="mr-2"
          loading={patchPRContractDetailsMutation.isPending}
        >
          <DocumentEditIcon size={14} className="ml-1" /> ثبت
        </Button>
      </div>
    </Form>
  )
}

export default PRContractEditDetails
