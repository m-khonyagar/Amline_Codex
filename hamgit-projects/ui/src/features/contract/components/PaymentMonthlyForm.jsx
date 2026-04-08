import { useMemo, useState } from 'react'
import { format } from 'date-fns-jalali'
import WrapperCard from './WrapperCard'
import { pickWithDefaults } from '@/utils/object'
import { handleErrorOnSubmit } from '@/utils/error'
import Button from '@/components/ui/Button'
import { Form, useForm, SelectWheelField } from '@/components/ui/Form'
import useCreateContractPayment from '../api/create-contract-payment'
import { paymentFormTypeEnum } from '@/features/contract'

const dayOptions = Array.from({ length: 31 }).map((_, i) => ({
  value: i + 1,
  label: i === 30 ? 'آخر' : i + 1,
}))

function PaymentMonthlyForm({ contractId, onConfirm, beforeSubmit, defaultValues, onCancel }) {
  const [isPendingBeforeSubmit, setIsPendingBeforeSubmit] = useState(false)

  const createContractMonthlyPaymentMutation = useCreateContractPayment(
    contractId,
    paymentFormTypeEnum.MONTHLY
  )

  const getDefaultValues = () => {
    const result = pickWithDefaults(defaultValues, { id: null, due_date: '' })

    if (result.due_date) {
      const index = Number(format(result.due_date, 'd')) - 1
      result.day = dayOptions?.[index]
    }

    return result
  }

  const methods = useForm({
    defaultValues: getDefaultValues(),
  })

  const isPending = useMemo(
    () => isPendingBeforeSubmit || createContractMonthlyPaymentMutation.isPending,
    [createContractMonthlyPaymentMutation.isPending, isPendingBeforeSubmit]
  )

  const handleSubmit = async (data) => {
    const _data = {
      day_of_month: data.day?.value,
    }

    if (beforeSubmit) {
      try {
        setIsPendingBeforeSubmit(true)
        await beforeSubmit()
      } catch (err) {
        return
      } finally {
        setIsPendingBeforeSubmit(false)
      }
    }

    setTimeout(() => {
      createContractMonthlyPaymentMutation.mutate(_data, {
        onError: (err) => {
          handleErrorOnSubmit(err, methods.setError, data)
        },
        onSuccess: (res) => {
          onConfirm?.(res)
        },
      })
    }, 1000)
  }

  return (
    <WrapperCard>
      <Form methods={methods} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <SelectWheelField
          required
          name="day"
          options={dayOptions}
          label="چندم هر ماه؟"
          placeholder="15 هر ماه"
          pickerSuffix="هر ماه"
          formatFn={({ label }) => `${label} هر ماه`}
        />

        <div className="flex gap-4">
          <Button className="basis-1/2" type="submit" loading={isPending}>
            تایید
          </Button>
          <Button
            className="basis-1/2"
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            انصراف
          </Button>
        </div>
      </Form>
    </WrapperCard>
  )
}

export default PaymentMonthlyForm
