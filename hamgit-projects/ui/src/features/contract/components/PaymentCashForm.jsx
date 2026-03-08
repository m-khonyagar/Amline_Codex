import { useMemo, useState } from 'react'

import WrapperCard from './WrapperCard'
import { paymentFormTypeEnum } from '../constants'
import usePatchPayment from '../api/patch-payment'
import useCreateContractPayment from '../api/create-contract-payment'

import { pickWithDefaults } from '@/utils/object'
import { handleErrorOnSubmit } from '@/utils/error'
import Button from '@/components/ui/Button'
import { DatePickerField, Form, InputField, InputNumberField, useForm } from '@/components/ui/Form'

function PaymentCashForm({
  contractId,
  onConfirm,
  beforeSubmit,
  defaultValues,
  onCancel,
  paymentType,
}) {
  const [isPendingBeforeSubmit, setIsPendingBeforeSubmit] = useState(false)
  const patchPayment = usePatchPayment(contractId, defaultValues?.id, paymentFormTypeEnum.CASH)
  const createContractPaymentMutation = useCreateContractPayment(
    contractId,
    paymentFormTypeEnum.CASH
  )

  const methods = useForm({
    defaultValues: pickWithDefaults(defaultValues, {
      id: null,
      amount: '',
      due_date: '',
      description: '',
      payment_type: '',
    }),
  })

  const isPending = useMemo(
    () =>
      isPendingBeforeSubmit || createContractPaymentMutation.isPending || patchPayment.isPending,
    [createContractPaymentMutation.isPending, isPendingBeforeSubmit, patchPayment.isPending]
  )

  const handleSubmit = async (data) => {
    const _data = {
      ...data,
      due_date: data?.due_date.substring(0, 10),
      payment_type: paymentType,
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

    const mutation = _data.id ? patchPayment : createContractPaymentMutation
    mutation.mutate(_data, {
      onError: (err) => {
        handleErrorOnSubmit(err, methods.setError, data)
      },

      onSuccess: (res) => {
        onConfirm?.(res)
      },
    })
  }

  return (
    <WrapperCard>
      <Form methods={methods} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <DatePickerField required name="due_date" label="تاریخ سررسید" placeholder="1370/12/09" />

        <InputNumberField
          required
          name="amount"
          label="مبلغ"
          suffix="تومان"
          decimalSeparator="/"
          placeholder="200,000,000"
        />

        <InputField multiline label="توضیحات (اختیاری)" name="description" />

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

export default PaymentCashForm
