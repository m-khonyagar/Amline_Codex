import { useState } from 'react'
import { format } from 'date-fns-jalali'
import Button from '@/components/ui/Button'
import { PaymentStatusEnums, PaymentStatusEnumsOptions } from '@/data/enums/payment_status_enums'
import { paymentCategoryEnumTranslation } from '@/data/enums/payment_category_enums'
import { paymentMethodEnum } from '@/features/contract'
import { useAuthContext } from '@/features/auth'
import PaymentsDetailsModal from './PaymentsDetailsModal'
import { handleErrorOnSubmit } from '@/utils/error'
import useClaimedToHavePaid from '../../api/claimedToHavePaid'
import usePayeeDeniedReceipt from '../../api/payeeDeniedReceipt'
import usePayeeConfirmedReceipt from '../../api/payeeConfirmedReceipt'

function PaymentCard({ payment }) {
  const { currentUser } = useAuthContext()
  const paymentDate = payment?.due_date || payment.paid_at
  const isPaid =
    payment?.status === PaymentStatusEnums.PAID ||
    payment?.status === PaymentStatusEnums.PAYEE_CONFIRMED_RECEIPT
  const isPayer = payment?.payer?.user_id === currentUser?.id
  const isPayee = payment?.payee?.user_id === currentUser?.id
  const status = PaymentStatusEnumsOptions.find((i) => i.value === payment?.status) || {}

  const [detailsModal, setDetailsModal] = useState(false)
  const claimedToHavePaid = useClaimedToHavePaid(payment.contract.id, payment.id)
  const payeeDeniedReceipt = usePayeeDeniedReceipt(payment.contract.id, payment.id)
  const payeeConfirmedReceipt = usePayeeConfirmedReceipt(payment.contract.id, payment.id)

  const handleClaimedToHavePaid = () => {
    claimedToHavePaid.mutate(null, {
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }
  const handlePayeeDeniedReceipt = () => {
    payeeDeniedReceipt.mutate(null, {
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }
  const handlePayeeConfirmedReceipt = () => {
    payeeConfirmedReceipt.mutate(null, {
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl flex flex-col gap-3 p-4 fa">
      <div className="flex justify-between items-center">
        <div className="flex gap-1 text-red-500" style={{ color: status.type?.color }}>
          {status.type && <status.type.icon />}
          <p>{status.label}</p>
        </div>
        <div className="bg-green-100 py-1 px-3 rounded-lg text-sm">
          {paymentCategoryEnumTranslation[payment?.type]}
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <p>مبلغ:</p>
        </div>
        <div>{payment?.amount?.toLocaleString()} تومان </div>
      </div>

      <div className="flex justify-between">
        <div>
          <p>موعد پرداخت:</p>
        </div>
        <div>{format(paymentDate, 'yyyy/MM/dd')}</div>
      </div>

      {isPaid ||
      (isPayee && payment.status !== PaymentStatusEnums.PAYER_CLAIMED_TO_HAVE_PAID) ||
      (isPayer && payment.status === PaymentStatusEnums.PAYER_CLAIMED_TO_HAVE_PAID) ? (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setDetailsModal(true)}
          disabled={!isPaid}
        >
          جزئیات پرداخت
        </Button>
      ) : null}

      {!isPaid &&
        isPayer &&
        payment?.method === paymentMethodEnum.CASH &&
        payment.status !== PaymentStatusEnums.PAYER_CLAIMED_TO_HAVE_PAID && (
          <div className="flex gap-2">
            <Button className="w-full" href={`/invoice/p/${payment.invoice?.id}`}>
              پرداخت
            </Button>
            <Button
              className="w-full"
              variant="outline"
              loading={claimedToHavePaid.isPending}
              onClick={handleClaimedToHavePaid}
            >
              نقدی پرداخت کردم
            </Button>
          </div>
        )}

      {!isPaid &&
        isPayee &&
        payment?.method === paymentMethodEnum.CASH &&
        payment.status === PaymentStatusEnums.PAYER_CLAIMED_TO_HAVE_PAID && (
          <div className="flex gap-2">
            <Button
              className="w-full"
              loading={payeeConfirmedReceipt.isPending}
              onClick={handlePayeeConfirmedReceipt}
            >
              تایید
            </Button>
            <Button
              className="w-full"
              variant="outline"
              loading={payeeDeniedReceipt.isPending}
              onClick={handlePayeeDeniedReceipt}
            >
              رد
            </Button>
          </div>
        )}

      <PaymentsDetailsModal
        open={detailsModal}
        onClose={() => setDetailsModal(false)}
        payment={payment}
      />
    </div>
  )
}

export default PaymentCard
