import { useMemo } from 'react'
import { format } from 'date-fns-jalali'
import { HeaderNavigation } from '@/features/app'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import useGetWalletSettlements from '../api/get-wallet-settlements'
import { settlementStatusOptions } from '../constants'
import { ClockIcon } from '@/components/icons'

export default function Settlements() {
  const query = useGetWalletSettlements()
  const settlements = useMemo(() => query.data?.data || [], [query.data])

  return (
    <>
      <HeaderNavigation title="سابقه درخواست" />

      <div className="flex-grow p-6 flex flex-col gap-5">
        <LoadingAndRetry query={query} skeletonItemHeight={140}>
          {!query.isPending && settlements.length === 0 && (
            <div className="flex-grow flex items-center justify-center text-gray-500">
              <div className="mb-16">تا به حال درخواست برداشتی ثبت نکردی!</div>
            </div>
          )}

          {settlements.map((i) => (
            <SettlementsCard key={i.id} settlement={i} />
          ))}
        </LoadingAndRetry>
      </div>
    </>
  )
}

function SettlementsCard({ settlement }) {
  const status = settlementStatusOptions.find((i) => i.value === settlement.status)

  return (
    <div className="bg-background rounded-2xl shadow-xl fa">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex text-sm">
          <div className="ml-1">مبلغ:</div>
          <div>{settlement.amount.toLocaleString('fa')} تومان</div>
        </div>

        <div className="flex justify-between text-xs">
          <div className="flex gap-1 text-red-500" style={{ color: status.type?.color }}>
            {status.type && <status.type.icon size={15} />}
            <p>{status.label}</p>
          </div>

          {settlement.created_at && (
            <div className="flex gap-1 items-center text-gray-500">
              <ClockIcon size={16} className="mb-0.5" />
              <div className="text-sm">
                {format(new Date(settlement.created_at), 'yyyy/MM/dd HH:mm')}
              </div>
            </div>
          )}
        </div>

        {settlement.description && <p>{settlement.description}</p>}

        <div className="flex justify-between text-sm">
          <div className="text-gray-500">مقصد:</div>
          <div>{settlement.shaba}</div>
        </div>

        <div className="flex justify-between text-sm">
          <div className="text-gray-500">به نام:</div>
          <div>{settlement.shaba_owner}</div>
        </div>
      </div>
    </div>
  )
}
