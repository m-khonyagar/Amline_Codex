import { cn } from '@/utils/dom'
import { useState } from 'react'
import { format } from 'date-fns-jalali'
import Button from '@/components/ui/Button'
import { translateEnum } from '@/utils/enum'
import { Dialog } from '@/components/ui/Dialog'
import { toast } from '@/components/ui/Toaster'
import { numberSeparator } from '@/utils/number'
import { handleErrorOnSubmit } from '@/utils/error'
import { CashIcon, CloseIcon } from '@/components/icons'
import useMarkContractPaymentAsPaid from '../../api/mark-contract-payment-as-paid'
import { InvoiceItemTypeOptions, InvoiceStatusOptions } from '@/data/enums/invoice_enums'
import {
  partyTypeOptions,
  paymentMethodOptions,
  paymentStatusOptions,
} from '@/data/enums/prcontract-enums'

const PRContractCommissionItem = ({ contractId, commission, paidBySystem, className }) => {
  const [isOpenPayWithSystemDialog, setIsOpenPayWithSystemDialog] = useState(false)

  const markAsPaidMutation = useMarkContractPaymentAsPaid(contractId, {
    onSuccess: () => {
      toast.success(`کمیسیون با موفقیت توسط سیستم پرداخت شد.`)

      setIsOpenPayWithSystemDialog(false)
    },
    onError: (e) => {
      handleErrorOnSubmit(e)
    },
  })

  return (
    <div className={cn('flex flex-col gap-2 fa', className)}>
      <div className="flex items-center">
        <div className="text-sm text-gray-700">پرداخت کننده:</div>
        <div className="mr-auto">
          {translateEnum(partyTypeOptions, commission.payer_party_type)}
        </div>
      </div>

      <div className="flex items-center">
        <div className="text-sm text-gray-700">روش پرداخت:</div>
        <div className="mr-auto">{translateEnum(paymentMethodOptions, commission.method)}</div>
      </div>

      <div className="flex items-center">
        <div className="text-sm text-gray-700">تاریخ سررسید:</div>
        <div className="mr-auto">
          {commission.due_date ? format(commission.due_date, 'dd MMMM yyyy') : '-'}
        </div>
      </div>

      <div className="flex items-center">
        <div className="text-sm text-gray-700">وضعیت پرداخت:</div>
        <div className="mr-auto">{translateEnum(paymentStatusOptions, commission.status)}</div>
      </div>

      <div className="flex items-center">
        <div className="text-sm text-gray-700">تاریخ سررسید:</div>
        <div className="mr-auto">
          {commission.paid_at ? format(commission.paid_at, 'dd MMMM yyyy HH:MM') : '-'}
        </div>
      </div>

      <div className="flex items-center">
        <div className="text-sm text-gray-700">وضعیت فاکتور:</div>
        <div className="mr-auto">
          {translateEnum(InvoiceStatusOptions, commission.invoice?.status)}
        </div>
      </div>

      <div className="flex items-center">
        <div className="text-sm text-gray-700">مبلغ اولیه:</div>
        <div className="mr-auto">
          {commission.invoice?.initial_amount ? (
            <>
              {numberSeparator(commission.invoice.initial_amount)}
              <span className="text-sm text-gray-500 mr-1">تومان</span>
            </>
          ) : (
            <span className="text-sm text-red-600">تنظیم نشده است</span>
          )}
        </div>
      </div>

      {commission.invoice.items.map((item) => (
        <div className="flex items-center" key={item.id}>
          <div className="text-sm text-gray-700">
            {translateEnum(InvoiceItemTypeOptions, item.type)}
          </div>
          <div className="mr-auto">
            {item.amount ? (
              <>
                {numberSeparator(item.amount)}
                <span className="text-sm text-gray-500 mr-1">تومان</span>
              </>
            ) : (
              '-'
            )}
          </div>
        </div>
      ))}

      <div className="flex items-center">
        <div className="text-sm text-gray-700">مبلغ نهایی:</div>
        <div className="mr-auto">
          {commission.invoice?.final_amount != null ? (
            <>
              {numberSeparator(commission.invoice.final_amount)}
              <span className="text-sm text-gray-500 mr-1">تومان</span>
            </>
          ) : (
            <span className="text-sm text-red-600">تنظیم نشده است</span>
          )}
        </div>
      </div>

      <div className="mt-4 text-left">
        <Button
          size="sm"
          variant="gray"
          disabled={!!commission.paid_at || !!paidBySystem}
          onClick={() => setIsOpenPayWithSystemDialog(true)}
        >
          <CashIcon size={14} className="ml-1" /> رد کردن کمیسیون توسط سیستم
        </Button>
      </div>

      <Dialog
        closeOnBackdrop={false}
        open={isOpenPayWithSystemDialog}
        onOpenChange={(s) => setIsOpenPayWithSystemDialog(s)}
      >
        <div>
          <div>
            برای رد کردن کمیسیون
            <strong className="inline-block mx-2 underline underline-offset-4">
              {translateEnum(partyTypeOptions, commission.payer_party_type)}
            </strong>
            توسط سیستم مطمئن هستید؟
          </div>

          <div className="mt-8 flex items-center justify-end">
            <Button
              size="sm"
              variant="gray"
              onClick={() => setIsOpenPayWithSystemDialog(false)}
              disabled={markAsPaidMutation.isPending}
            >
              <CloseIcon size={14} className="ml-1" /> انصراف
            </Button>
            <Button
              size="sm"
              className="mr-2"
              loading={markAsPaidMutation.isPending}
              onClick={() => markAsPaidMutation.mutate(commission.id)}
            >
              <CashIcon size={14} className="ml-2" /> رد کردن توسط سیستم
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default PRContractCommissionItem
