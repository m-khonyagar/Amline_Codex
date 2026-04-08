import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { HeaderNavigation } from '@/features/app'
import { getPaymentSteps } from '../../../libs/payment-steps'
import NavigationItem from '../../../components/NavigationItem'
import { useContractLogic } from '@/features/contract'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import useGetContractStatus from '../../../api/get-contract-status'

function PaymentPage() {
  const router = useRouter()
  const { contractId } = router.query

  const contractStatusQuery = useGetContractStatus(contractId, { enabled: router.isReady })
  const { data: statuses } = contractStatusQuery

  const { signedByCurrentUser } = useContractLogic(statuses)

  const steps = useMemo(() => (statuses ? getPaymentSteps(statuses) : []), [statuses])

  useEffect(() => {
    if (signedByCurrentUser) {
      router.replace(`/contracts/${contractId}`)
    }
  }, [contractId, signedByCurrentUser, router])

  return (
    <div>
      <HeaderNavigation title="پرداخت" backUrl={`/contracts/${contractId}/manage/date-payment`} />

      <div className="px-6 mt-6 flex flex-col gap-4">
        <LoadingAndRetry
          checkRefetching
          query={contractStatusQuery}
          skeletonItemHeight={45}
          skeletonItemCount={2}
        >
          {contractStatusQuery.data &&
            steps.map((step) => (
              <NavigationItem
                key={step.title}
                label={step.title}
                disabled={!step.isActive}
                completed={step.completed}
                href={`/contracts/${contractId}/manage/date-payment/payment/${step.link}`}
              />
            ))}
        </LoadingAndRetry>
      </div>
    </div>
  )
}

export default PaymentPage
