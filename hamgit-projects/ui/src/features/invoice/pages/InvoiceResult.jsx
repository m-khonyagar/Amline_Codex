import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import useGetInvoice from '../api/get-invoice'
import { BottomCTA } from '@/features/app'
import { CircleCheckBoldIcon, CircleCloseBoldIcon } from '@/components/icons'
import { cn } from '@/utils/dom'
import Button from '@/components/ui/Button'
import LoadingAndRetry, { CircleLoading } from '@/components/LoadingAndRetry'
import { InvoiceStatusEnums } from '@/data/enums/invoice_status_enums'
import { walletTransactionCategory } from '../../wallet/constants'

function InvoiceResultPage() {
  const router = useRouter()
  const { invoice_id: invoiceId } = router.query

  const invoiceQuery = useGetInvoice(invoiceId)
  const invoiceData = useMemo(() => invoiceQuery?.data || {}, [invoiceQuery?.data])
  const isSuccess = useMemo(() => invoiceData?.status === InvoiceStatusEnums.PAID, [invoiceData])
  const isWalletPayment = useMemo(
    () => invoiceData?.category === walletTransactionCategory.WALLET_CHARGE,
    [invoiceData]
  )

  const isContractPayment = [
    walletTransactionCategory.RENT,
    walletTransactionCategory.DEPOSIT,
    walletTransactionCategory.COMMISSION,
  ].includes(invoiceData.category)

  return (
    <>
      <div className="my-auto text-center">
        <LoadingAndRetry query={invoiceQuery} loadingComponent={CircleLoading} checkRefetching>
          {invoiceQuery.data && (
            <div
              className={cn('flex flex-col gap-6 justify-center items-center', {
                'text-green-600': isSuccess,
                'text-red-600': !isSuccess,
              })}
            >
              {isSuccess ? <CircleCheckBoldIcon size={64} /> : <CircleCloseBoldIcon size={64} />}

              {isSuccess ? 'پرداخت با موفقیت انجام شد' : 'پرداخت ناموفق بود'}
            </div>
          )}
        </LoadingAndRetry>
      </div>

      <BottomCTA>
        <LoadingAndRetry query={invoiceQuery} skeletonItemCount={1}>
          {isContractPayment && (
            <Button
              className="w-full"
              href={`/contracts/${invoiceQuery.data?.contract_id}`}
              replace
            >
              بازگشت به قرارداد
            </Button>
          )}
          {isWalletPayment && (
            <Button className="w-full" href="/wallet/" replace>
              بازگشت به کیف پول
            </Button>
          )}
          {!isWalletPayment && !isContractPayment && (
            <Button className="w-full" href="/" replace>
              بازگشت به خانه
            </Button>
          )}
        </LoadingAndRetry>
      </BottomCTA>
    </>
  )
}

export default InvoiceResultPage
