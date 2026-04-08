import { format } from 'date-fns-jalali'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import {
  paymentCategoryEnum,
  paymentCategoryEnumTranslation,
} from '@/data/enums/payment_category_enums'
import { paymentMethodEnumTranslation } from '@/features/contract'
import { InvoiceItemEnums, InvoiceItemEnumsTranslation } from '@/data/enums/invoice_item_enums'
import { cn } from '@/utils/dom'

export default function PaymentsDetailsModal({ payment, onClose, open }) {
  const invoice = payment.invoice || {}
  const isCommission = payment.type === paymentCategoryEnum.COMMISSION

  return (
    <Modal open={open} onClose={() => onClose?.()} className="w-96">
      <p className="font-bold text-center mb-4">{paymentCategoryEnumTranslation[payment?.type]}</p>
      <div className="flex justify-between mb-2">
        <span>شیوه پرداخت:</span>
        <span>{paymentMethodEnumTranslation[payment.method]}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>تاریخ سررسید:</span>
        <span dir="ltr">{format(payment.due_date, 'yyyy/MM/dd')}</span>
      </div>

      {payment.paid_at && (
        <div className="flex justify-between mb-2">
          <span>تاریخ پرداخت:</span>
          <span dir="ltr">{format(payment.paid_at, 'yyyy/MM/dd - HH:mm')}</span>
        </div>
      )}

      <div className="flex justify-between mb-2 fa">
        <p>مبلغ کل :</p>
        <p>
          {isCommission
            ? invoice.initial_amount?.toLocaleString('fa')
            : payment.amount.toLocaleString('fa')}{' '}
          تومان
        </p>
      </div>

      {invoice.items?.length > 0 &&
        invoice.items.map((item) => (
          <div
            key={item.id}
            className={cn('flex justify-between fa mb-2', {
              'text-red-600': item.type === InvoiceItemEnums.DISCOUNT,
            })}
          >
            <p>{InvoiceItemEnumsTranslation[item.type]} :</p>
            <p>
              <span dir="ltr" className="ml-1">
                {item.amount.toLocaleString('fa')}
              </span>
              تومان
            </p>
          </div>
        ))}

      {isCommission && (
        <div className="flex justify-between mb-2">
          <p>مبلغ قابل پرداخت :</p>
          <span>{invoice.final_amount?.toLocaleString('fa')} تومان</span>
        </div>
      )}

      {payment.payee &&
        (payment.payee.owner_name === 'AMLINE' ? (
          <div className="flex justify-between mb-2">
            <span>به حساب:</span>
            <span>املاین</span>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-2">
              <span>شماره شبا:</span>
              <span>{payment.payee?.iban}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>به نام:</span>
              <span>{payment.payee?.owner_name}</span>
            </div>
          </>
        ))}

      {payment.description && (
        <p className="mb-2">
          <span>توضیحات: </span>
          <span>{payment.description}</span>
        </p>
      )}

      <Button onClick={() => onClose?.()} className="w-full">
        تایید
      </Button>
    </Modal>
  )
}
