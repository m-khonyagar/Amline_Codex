import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'
import { parse, format } from 'date-fns-jalali'
import { format as fnsFormat } from 'date-fns'
import { handleErrorOnSubmit } from '@/utils/error'
import { CloseIcon, DocumentEditIcon } from '@/components/icons'
import { DatePickerField, Form, useForm } from '@/components/ui/Form'
import useCreatePRContractMonthlyRentPayment from '../../api/create-pr-contract-monthly-rent-payment'

const PRContractMonthlyRentPaymentCreation = ({ prContract, onCancel, onSuccess }) => {
  const methods = useForm({
    defaultValues: async () => {
      const rentDay = prContract?.rent_day

      return {
        date: rentDay ? fnsFormat(parse(`${rentDay}`, 'd', new Date()), 'yyyy-MM-dd') : '',
      }
    },
  })

  const createMonthlyRentMutation = useCreatePRContractMonthlyRentPayment(prContract.contract.id)

  const handleSubmit = (data, { setError }) => {
    createMonthlyRentMutation.mutate(
      {
        day_of_month: format(new Date(data.date), 'd'),
      },
      {
        onSuccess: (res) => {
          toast.success('پرداخت‌های اجاره ماهیانه با موفقیت ایجاد شد')

          onSuccess(res)
        },
        onError: (e) => {
          handleErrorOnSubmit(e, setError, data)
        },
      }
    )
  }
  return (
    <div>
      <Form methods={methods} onSubmit={handleSubmit}>
        <DatePickerField
          monthPicker={false}
          yearPicker={false}
          label="روز پرداخت"
          name="date"
          inputFormat="yyyy-MM-dd"
          outputFormat="YYYY-MM-DD"
          format="D"
        />

        <div className="mt-4 text-left">
          <Button
            size="sm"
            variant="gray"
            onClick={onCancel}
            disabled={createMonthlyRentMutation.isPending}
          >
            <CloseIcon size={14} className="ml-1" /> انصراف
          </Button>
          <Button
            size="sm"
            type="submit"
            className="mr-2"
            loading={createMonthlyRentMutation.isPending}
          >
            <DocumentEditIcon size={14} className="ml-1" /> ثبت
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default PRContractMonthlyRentPaymentCreation
