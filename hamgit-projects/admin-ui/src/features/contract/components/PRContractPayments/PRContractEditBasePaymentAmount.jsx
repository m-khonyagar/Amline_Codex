import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'
import { pickWithDefaults } from '@/utils/object'
import { handleErrorOnSubmit } from '@/utils/error'
import { CloseIcon, DocumentEditIcon } from '@/components/icons'
import { Form, InputNumberField, useForm } from '@/components/ui/Form'
import useUpdatePRContractDetails from '../../api/update-pr-contract-details'

const PRContractEditBasePaymentAmount = ({ prContract, onCancel, onSuccess }) => {
  const methods = useForm({
    defaultValues: pickWithDefaults(prContract, {
      deposit_amount: '',
      rent_amount: { path: 'monthly_rent_amount', default: '' },
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
    <div>
      <Form methods={methods} onSubmit={handleSubmit}>
        <InputNumberField
          required
          suffix="تومان"
          label="مبلغ رهن"
          decimalSeparator="/"
          placeholder="200,000,000"
          name="deposit_amount"
        />

        <InputNumberField
          required
          suffix="تومان"
          decimalSeparator="/"
          placeholder="3,000,000"
          name="rent_amount"
          label="مبلغ اجاره ماهیانه"
        />

        <div className="mt-4 text-left">
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
    </div>
  )
}

export default PRContractEditBasePaymentAmount
