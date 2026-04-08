import React, { useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { BottomCTA, HeaderNavigation } from '@/features/app'
import upImg from '@/assets/images/up.svg'
import { CircleLoadingIcon, TomanIcon } from '@/components/icons'
import { numberSeparator } from '@/utils/number'
import { Form, InputNumberField, useForm } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import useGetWallet from '../api/get-wallet'
import useChargeWallet from '../api/charge-wallet'
import { handleErrorOnSubmit } from '@/utils/error'
import useBankGateway from '../../invoice/api/bank-gateway'
import { bankGatewayEnums } from '@/features/contract'

const suggestions = [500000, 1000000, 2000000]

export default function Charge() {
  const router = useRouter()
  const walletQuery = useGetWallet()
  const wallet = useMemo(() => walletQuery?.data, [walletQuery?.data])

  const methods = useForm({ defaultValues: { amount: '' } })
  const getBankGateway = useBankGateway()
  const submitInvoice = (invoiceId) => {
    getBankGateway.mutate(
      {
        invoice_id: invoiceId,
        bank_gateway: bankGatewayEnums.PARSIAN,
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
  }

  const chargeMutation = useChargeWallet()
  const handleSubmit = (data) => {
    chargeMutation.mutate(
      {
        credit_charge_amount: data.amount,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.id) {
            submitInvoice(res?.data?.id)
          }
        },
        onError: (e) => {
          handleErrorOnSubmit(e)
        },
      }
    )
  }

  return (
    <>
      <HeaderNavigation title="افزایش موجودی" />

      <div className="flex flex-col fa px-6">
        <div className="div text-center my-16">
          <Image width={148} height={148} src={upImg.src} alt="wallet" className="mx-auto mb-6" />
          <h3 className="font-medium text-lg mb-1">افزایش موجودی</h3>
          <p className="text-[#878787] text-sm flex gap-0.5 justify-center">
            موجودی فعلی:
            <span>
              {!wallet || walletQuery.isPending ? (
                <CircleLoadingIcon size={15} className="animate-spin" />
              ) : (
                numberSeparator(wallet.credit) || '0'
              )}
            </span>
            تومان
          </p>
        </div>

        <div className="flex justify-center gap-2 overflow-x-scroll no-scrollbar mb-6">
          {suggestions.map((i) => (
            <button
              type="button"
              key={i}
              className="bg-gray-200 flex items-center gap-1 rounded-full px-2 flex-wrap min-w-fit"
              onClick={() => methods.setValue('amount', i)}
            >
              {numberSeparator(i)}
              <TomanIcon size={20} />
            </button>
          ))}
        </div>

        <div className="max-w-full w-[300px] mx-auto">
          <Form methods={methods} onSubmit={handleSubmit}>
            <InputNumberField
              required
              name="amount"
              label="مبالغ دیگر"
              suffix="تومان"
              decimalSeparator="/"
              placeholder="وارد کنید"
            />

            <BottomCTA>
              <Button type="submit" className="w-full" loading={chargeMutation.isPending}>
                پرداخت
              </Button>
            </BottomCTA>
          </Form>
        </div>
      </div>
    </>
  )
}
