import Link from 'next/link'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useGetInvoice from '../api/get-invoice'
import { BottomCTA, HeaderNavigation } from '@/features/app'
import useGetWallet from '../../wallet/api/get-wallet'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import Button from '@/components/ui/Button'
import InputNumber from '@/components/ui/InputNumber'
import { CheckboxField, Form, InputNumberField, useForm } from '@/components/ui/Form'
import { toast } from '@/components/ui/Toaster'
import { PlusIcon } from '@/components/icons'
import useBankGateway from '../api/bank-gateway'
import { bankGatewayEnums } from '@/features/contract'
import { handleErrorOnSubmit } from '@/utils/error'

const formSchema = z.object({
  amount: z.string({ message: 'این گزینه اجباریه' }).min(1, { message: 'این گزینه اجباریه' }),
  is_full: z.boolean(),
})
const defaultValues = {
  amount: '',
  is_full: false,
}

export default function InvoiceWallet() {
  const walletQuery = useGetWallet()

  const credit = useMemo(() => walletQuery?.data?.data?.credit || 0, [walletQuery?.data])

  const router = useRouter()
  const { invoiceId } = router.query
  const invoiceQuery = useGetInvoice(invoiceId)
  const { data: invoice } = invoiceQuery

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(formSchema),
  })

  const amountValue = methods.watch('amount')
  const remainingAmount = useMemo(() => {
    const diff = Number(invoice?.final_amount || 0) - Number(amountValue || 0)
    return diff > 0 ? diff : 0
  }, [invoice, amountValue])
  useEffect(() => {
    if (Number(invoice?.final_amount || 0) > Number(amountValue)) {
      methods.setValue('is_full', false)
    }
  }, [amountValue])

  const isFull = methods.watch('is_full')
  useEffect(() => {
    if (isFull) {
      if (Number(invoice?.final_amount || 0) > Number(credit)) {
        methods.setValue('is_full', false)
        toast.error('موجودی کیف پول کافی نیست')
      } else {
        methods.setValue('amount', invoice?.final_amount)
      }
    }
  }, [isFull])

  const getBankGateway = useBankGateway()

  const handleSubmit = (data) => {
    if (Number(data.amount || 0) > Number(credit)) {
      return toast.error('موجودی کیف پول کافی نیست')
    }
    if (Number(data.amount || 0) > Number(invoice?.final_amount || 0)) {
      return toast.error('مبلغ وارد شده بیشتر از مبلغ فاکتور است!')
    }

    getBankGateway.mutate(
      {
        invoice_id: invoiceId,
        bank_gateway: bankGatewayEnums.PARSIAN,
        use_wallet_credit: true,
        use_all_wallet_credits: data.is_full,
        wallet_credits: data.amount,
      },
      {
        onSuccess: (res) => {
          if (res.data.success) {
            router.push(res?.data?.message)
          }
        },
        onError: (err) => {
          handleErrorOnSubmit(err)
        },
      }
    )

    return ''
  }

  return (
    <>
      <HeaderNavigation title="پرداخت" />

      <div className="p-6 fa">
        <LoadingAndRetry query={[invoiceQuery, walletQuery]}>
          <div className="bg-background rounded-2xl p-4 shadow-xl border border-gray-200 mb-6">
            <InputNumber
              name="credit"
              suffix="تومان"
              value={credit}
              decimalSeparator="/"
              label="موجودی کیف پول"
              readOnly
              suffixIcon={
                <Link href="/wallet/charge">
                  <PlusIcon className="text-primary" />
                </Link>
              }
            />
          </div>

          <Form onSubmit={handleSubmit} methods={methods}>
            <InputNumberField
              name="amount"
              suffix="تومان"
              decimalSeparator="/"
              label="مبلغ پرداخت از کیف پول"
              placeholder="وارد کنید"
            />

            <CheckboxField name="is_full" label="پرداخت کل مبلغ با کیف پول" />

            <div className="bg-background rounded-2xl p-4 shadow-xl border border-gray-200 my-6">
              <div className="flex justify-between items-center">
                <div className="font-medium">مبلغ فاکتور:</div>
                <div>{invoice?.final_amount.toLocaleString()} تومان</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="font-medium">باقیمانده :</div>
                <div>{remainingAmount.toLocaleString()} تومان</div>
              </div>
            </div>

            <BottomCTA>
              <Button type="submit" className="w-full">
                پرداخت
              </Button>
            </BottomCTA>
          </Form>
        </LoadingAndRetry>
      </div>
    </>
  )
}
