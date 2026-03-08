import { useMemo, useState } from 'react'
import { format } from 'date-fns-jalali'
import Collapse from '@/components/ui/Collapse'
import { cn, fullName } from '@/utils/dom'
import { ChevronDownIcon, ChevronUpIcon } from '@/components/icons'
import { walletTransactionCategory, walletTransactionCategoryTranslations } from '../constants'
import useGetInvoice from '../../invoice/api/get-invoice'
import LoadingAndRetry from '@/components/LoadingAndRetry'

export default function WalletReceiptCard({ transaction }) {
  const [isOpen, setIsOpen] = useState(false)

  const [invoiceId, setInvoiceId] = useState('')
  const invoiceQuery = useGetInvoice(invoiceId)
  const invoiceData = useMemo(() => invoiceQuery?.data || {}, [invoiceQuery?.data])

  const toggleCollapse = () => {
    setIsOpen((s) => !s)

    if (!invoiceId) {
      setInvoiceId(transaction.invoice_id)
    }
  }

  const isContractPayment = [
    walletTransactionCategory.RENT,
    walletTransactionCategory.DEPOSIT,
    walletTransactionCategory.COMMISSION,
  ].includes(transaction.category)

  return (
    <div className="bg-background rounded-2xl shadow-xl fa">
      <div className="p-4 flex flex-col gap-4">
        <div
          className={cn(
            'rounded-xl px-2 py-0.5 text-sm self-end',
            transaction.amount > 0 ? 'bg-[#A9DDB4]' : 'bg-[#FA9E9E]'
          )}
        >
          {transaction.amount > 0 ? 'افزایش' : 'کاهش'}
        </div>

        <div className="flex justify-between text-sm">
          <div className="text-gray-500">مبلغ:</div>
          <div>{transaction.amount.toLocaleString('fa')} تومان</div>
        </div>

        <div className="flex justify-between text-sm">
          <div className="text-gray-500">بابت:</div>
          <div>{walletTransactionCategoryTranslations[transaction.category]}</div>
        </div>
      </div>

      <Collapse in={isOpen} className="flex flex-col gap-4 p-4 pt-0">
        <LoadingAndRetry query={invoiceQuery} skeletonItemCount={1}>
          {invoiceData?.payee?.id && (
            <div className="flex justify-between text-sm">
              <div className="text-gray-500">پرداخت شده توسط: </div>
              <div>
                {transaction.category === walletTransactionCategory.REFUND
                  ? 'املاین'
                  : fullName(invoiceData?.payer)}
              </div>
            </div>
          )}
          {isContractPayment && (
            <div className="flex justify-between text-sm">
              <div className="text-gray-500">شناسه قرارداد: </div>
              <div>{invoiceData.contract_id}</div>
            </div>
          )}
        </LoadingAndRetry>
      </Collapse>

      <hr />

      <button
        className="w-full flex p-4 flex-col items-center"
        type="button"
        onClick={() => toggleCollapse()}
        disabled={!transaction.invoice_id}
      >
        {transaction.created_at && (
          <div className="w-full flex justify-between text-sm">
            <div>{format(transaction.created_at, 'yyyy/MM/dd')}</div>
            <div>{format(transaction.created_at, 'HH:mm')}</div>
          </div>
        )}

        {transaction.invoice_id &&
          (isOpen ? (
            <ChevronUpIcon className="text-teal-600 -my-2" size={16} />
          ) : (
            <ChevronDownIcon className="text-teal-600 -my-2" size={16} />
          ))}
      </button>
    </div>
  )
}
