import { useMemo, createElement, useState } from 'react'
import { format } from 'date-fns-jalali'
import Button from '@/components/ui/Button'
import { paymentCategoryEnumTranslation } from '@/data/enums/payment_category_enums'
import PaymentsDetailsModal from '../../contract/components/payment/PaymentsDetailsModal'
import { PaymentStatusEnums, PaymentStatusEnumsOptions } from '@/data/enums/payment_status_enums'

function ReceiptCard({ payment }) {
  const status = useMemo(
    () => PaymentStatusEnumsOptions.find((o) => o.value === payment.status),
    [payment]
  )
  const isPaid =
    payment?.status === PaymentStatusEnums.PAID ||
    payment?.status === PaymentStatusEnums.PAYEE_CONFIRMED_RECEIPT
  const [detailsModal, setDetailsModal] = useState(false)

  return (
    <div className="bg-background rounded-2xl shadow-xl fa">
      <div className="p-4 flex flex-col gap-4">
        <div className="w-full flex justify-between items-center text-sm">
          <div style={{ color: status.type.color }}>
            <div className="flex gap-2">
              <div>{createElement(status.type.icon, { size: 20 })}</div>
              <p>{status.label}</p>
            </div>
          </div>
          <div className="bg-green-100 rounded-lg px-3 pb-0.5 text-sm self-end">
            {paymentCategoryEnumTranslation[payment.type]}
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <div className="text-gray-500">قرارداد:</div>
          <div>{payment.contract?.id}</div>
        </div>

        <div className="flex justify-between text-sm">
          <div className="text-gray-500">مبلغ:</div>
          <div>{(payment.final_amount || payment.amount).toLocaleString('fa')} تومان</div>
        </div>

        {payment.due_date && (
          <div className="flex justify-between text-sm">
            <div className="text-gray-500">تاریخ سررسید:</div>
            <div>{format(payment.due_date, 'yyyy/MM/dd')}</div>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setDetailsModal(true)}
          disabled={!isPaid}
        >
          جزئیات پرداخت
        </Button>
      </div>
      <PaymentsDetailsModal
        open={detailsModal}
        onClose={() => setDetailsModal(false)}
        payment={payment}
      />
    </div>
  )
}

export default ReceiptCard
