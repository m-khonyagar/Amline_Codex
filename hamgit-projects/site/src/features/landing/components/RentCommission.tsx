'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useCalculateCommission } from '../queries/use-calculate-commission'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { InputNumber } from '@/components/ui/input-number'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { TomanIcon } from '@/assets/icons'

import rentCommissionImg from '../assets/images/rent-commission.webp'

export const RentCommission = ({ className }: { className?: string }) => {
  const [deposit, setDeposit] = useState<number | undefined>(undefined)
  const [rent, setRent] = useState<number | undefined>(undefined)
  const [isShowResult, setIsShowResult] = useState(false)

  const { mutate: calculateCommission, data: commissionData, isPending } = useCalculateCommission()

  const handleCalculateCommission = () => {
    if (!rent || !deposit) {
      toast.error('لطفا رهن و اجاره را وارد کنید.')
      return
    }

    calculateCommission(
      { rent_amount: rent, security_deposit_amount: deposit },
      {
        onSuccess: () => setIsShowResult(true),
        onError: console.error,
      },
    )
  }

  return (
    <section className={cn('relative bg-sky-950', className)}>
      <div className="container">
        <div className="mr-auto flex flex-col py-6 pr-4 text-white sm:py-24 md:w-7/12">
          <h3 className="mb-4 font-bold sm:text-base md:text-xl lg:text-2xl">هزینه بستن قرارداد</h3>

          <p className="mb-10 text-sm font-medium md:text-base lg:mb-11 lg:text-lg">
            هزینه انعقاد قرارداد در املاین بر اساس کمیسیون مصوب اتحادیه املاک و طبق ارزش ملک محاسبه
            می‌شه. اگه می‌خوای بدونی به‌صورت قانونی چقدر باید پرداخت کنی، اینجا محاسبه‌ش کن:
          </p>

          <div className="flex flex-col flex-wrap gap-4 lg:flex-row lg:items-end">
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="deposit">مبلغ ودیعه‌ (رهن)</Label>
                <InputNumber
                  id="deposit"
                  value={deposit}
                  onValueChange={setDeposit}
                  leftIcon={<TomanIcon className="size-5" />}
                />
              </div>
              <div className="grid flex-1 gap-2">
                <Label htmlFor="rent">مبلغ اجاره</Label>
                <InputNumber
                  id="rent"
                  value={rent}
                  onValueChange={setRent}
                  leftIcon={<TomanIcon className="size-5" />}
                />
              </div>
            </div>
            <Button onClick={handleCalculateCommission} loading={isPending}>
              محاسبه کمیسیون
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 h-full w-5/12 max-md:hidden">
        <Image fill alt="محاسبه کمیسیون" className="object-cover" src={rentCommissionImg} />
      </div>

      <Dialog open={isShowResult} onOpenChange={setIsShowResult}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>محاسبه کمیسیون</DialogTitle>
            <DialogDescription hidden>محاسبه کمیسیون</DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="deposit-2">مبلغ ودیعه‌ (رهن)</Label>
                <InputNumber
                  id="deposit-2"
                  value={deposit}
                  onValueChange={setDeposit}
                  leftIcon={<TomanIcon className="size-5" />}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rent-2">مبلغ اجاره</Label>
                <InputNumber
                  id="rent-2"
                  value={rent}
                  onValueChange={setRent}
                  leftIcon={<TomanIcon className="size-5" />}
                />
              </div>
            </div>

            <div className="fa flex flex-col gap-2 rounded-lg bg-stone-50 px-5 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-500">
                  کمیسیون هر یک از طرفین قرارداد
                </p>
                <div className="flex items-center gap-1">
                  <div className="text-sm font-medium text-neutral-950">
                    {commissionData?.commission?.toLocaleString()}
                  </div>
                  <TomanIcon className="size-5 text-neutral-500" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-500">
                  مالیات هر یک از طرفین قرارداد
                </p>
                <div className="flex items-center gap-1">
                  <div className="text-sm font-medium text-neutral-950">
                    {commissionData?.tax?.toLocaleString()}
                  </div>
                  <TomanIcon className="size-5 text-neutral-500" />
                </div>
              </div>

              <div className="h-0 border-t border-zinc-200" />

              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-500">مجموع</p>
                <div className="flex items-center gap-1">
                  <div className="text-sm font-medium text-neutral-950">
                    {commissionData?.total?.toLocaleString()}
                  </div>
                  <TomanIcon className="size-5 text-neutral-500" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCalculateCommission} loading={isPending}>
              محاسبه کمیسیون
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
