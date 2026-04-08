import Button from '@/components/ui/Button'
import { translateEnum } from '@/utils/enum'
import { CloseIcon } from '@/components/icons'
import { toast } from '@/components/ui/Toaster'
import { numberSeparator } from '@/utils/number'
import { handleErrorOnSubmit } from '@/utils/error'
import { paymentTypeOptions } from '@/data/enums/prcontract-enums'
import useDeletePRContractPayment from '../../api/delete-pr-contract-payment'

const PRContractPaymentDelete = ({ payment, onCancel, onSuccess }) => {
  payment = payment || {}

  const deletePRcontractPaymentMutation = useDeletePRContractPayment(payment.contract?.id, {
    onSuccess: (res) => {
      toast.success(`پرداخت حذف شد.`)

      onSuccess?.(res)
    },
    onError: (e) => {
      handleErrorOnSubmit(e)
    },
  })

  return (
    <div>
      <div className="fa">
        آیا از حذف پرداخت{' '}
        <span className="font-bold">{translateEnum(paymentTypeOptions, payment.type)}</span> به مبلغ{' '}
        {numberSeparator(payment.amount)} تومان مطمئن هستید؟
      </div>

      <div className="mt-4 flex items-center justify-end">
        <Button
          size="sm"
          variant="gray"
          onClick={onCancel}
          disabled={deletePRcontractPaymentMutation.isPending}
        >
          <CloseIcon size={14} className="ml-1" /> انصراف
        </Button>
        <Button
          size="sm"
          className="mr-2"
          variant="danger"
          loading={deletePRcontractPaymentMutation.isPending}
          onClick={() => deletePRcontractPaymentMutation.mutate(payment.id)}
        >
          حذف
        </Button>
      </div>
    </div>
  )
}

export default PRContractPaymentDelete
