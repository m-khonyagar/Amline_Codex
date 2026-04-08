import { useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { BottomCTA, HeaderNavigation } from '@/features/app'
import exportImg from '@/assets/images/export.svg'
import useGetWallet from '../api/get-wallet'
import { CircleLoadingIcon } from '@/components/icons'
import { numberSeparator } from '@/utils/number'
import { Form, InputField, InputNumberField, useForm } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import useCreateWalletSettlements from '../api/create-wallet-settlements'
import { handleErrorOnSubmit } from '@/utils/error'

const defaultValues = {
  shaba: '',
  amount: '',
  shaba_owner: '',
}

export default function Withdrawal() {
  const router = useRouter()
  const walletQuery = useGetWallet()
  const wallet = useMemo(() => walletQuery?.data?.data, [walletQuery?.data])

  const methods = useForm({
    defaultValues,
  })

  const mutation = useCreateWalletSettlements()

  const handleSubmit = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        router.push('/wallet/withdrawal/result')
      },
      onError: (err) => {
        handleErrorOnSubmit(err)
      },
    })
  }

  return (
    <>
      <HeaderNavigation title="برداشت/انتقال" />

      <div className="px-6 fa">
        <div className="div text-center mt-16 mb-6">
          <Image
            width={148}
            height={148}
            src={exportImg.src}
            alt="wallet"
            className="mx-auto mb-6"
          />
          <h3 className="font-medium text-lg mb-1">برداشت/انتقال</h3>
          <p className="text-[#878787] text-sm flex gap-0.5 justify-center">
            موجودی فعلی:
            <span>
              {!wallet && ' '}
              {walletQuery.isPending && <CircleLoadingIcon size={15} className="animate-spin" />}
              {wallet && (numberSeparator(wallet.credit) || '0')}
            </span>
            تومان
          </p>
        </div>

        <Form methods={methods} onSubmit={handleSubmit}>
          <InputNumberField
            required
            name="amount"
            label="مبلغ"
            suffix="تومان"
            decimalSeparator="/"
            placeholder="وارد کنید"
          />

          <InputField required name="shaba" label="مقصد" placeholder="24 رقم" suffix="IR" />

          <InputField required label="نام صاحب حساب" name="shaba_owner" placeholder="وارد کنید" />

          <BottomCTA>
            <Button type="submit" className="w-full" loading={mutation.isPending}>
              تایید
            </Button>
          </BottomCTA>
        </Form>
      </div>
    </>
  )
}
