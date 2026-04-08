import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { HeaderNavigation } from '@/features/app'
import NavigationItem from '../../components/NavigationItem'
import { getDateAndPaymentSteps } from '../../libs/date-payment-steps'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import useGetContractStatus from '../../api/get-contract-status'

function DateAndPaymentPage() {
  const router = useRouter()
  const { contractId } = router.query

  const contractStatusQuery = useGetContractStatus(contractId, { enabled: router.isReady })
  const { data: statuses } = contractStatusQuery

  const steps = useMemo(() => (statuses ? getDateAndPaymentSteps(statuses) : []), [statuses])

  return (
    <div>
      <HeaderNavigation title="تاریخ و پرداخت" backUrl={`/contracts/${contractId}/manage`} />

      <div className="px-6 mt-6 flex flex-col gap-4">
        <LoadingAndRetry query={contractStatusQuery} skeletonItemHeight={45} skeletonItemCount={2}>
          {contractStatusQuery.data &&
            steps.map((step) => (
              <NavigationItem
                key={step.title}
                label={step.title}
                disabled={!step.isActive}
                completed={step.completed}
                onDisabledClick={step.onDisabledClick}
                href={`/contracts/${contractId}/manage/date-payment/${step.link}`}
              />
            ))}
        </LoadingAndRetry>
      </div>
    </div>
  )
}

export default DateAndPaymentPage
