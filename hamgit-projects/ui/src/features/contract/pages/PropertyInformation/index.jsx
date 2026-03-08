import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { getPropertyInformationSteps } from '../../libs/property-steps'
import { HeaderNavigation } from '@/features/app'
import NavigationItem from '../../components/NavigationItem'
import { useContractLogic } from '@/features/contract'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import useGetContractStatus from '../../api/get-contract-status'

function PropertyInformationPage() {
  const router = useRouter()
  const { contractId } = router.query

  const contractStatusQuery = useGetContractStatus(contractId, { enabled: router.isReady })
  const { data: statuses } = contractStatusQuery

  const { signedByCurrentUser } = useContractLogic(statuses)

  const steps = useMemo(() => getPropertyInformationSteps(statuses), [statuses])

  useEffect(() => {
    if (signedByCurrentUser) {
      router.replace(`/contracts/${contractId}`)
    }
  }, [contractId, signedByCurrentUser, router])

  return (
    <div>
      <HeaderNavigation title="اطلاعات ملک اجاره ای" backUrl={`/contracts/${contractId}/manage`} />

      <div className="px-6 mt-6 flex flex-col gap-4">
        <LoadingAndRetry query={contractStatusQuery} skeletonItemHeight={45} skeletonItemCount={3}>
          {contractStatusQuery.data &&
            steps.map((step) => (
              <NavigationItem
                key={step.title}
                label={step.title}
                disabled={step.disabled}
                completed={step.completed}
                href={`/contracts/${contractId}/manage/property-information/${step.link}`}
              />
            ))}
        </LoadingAndRetry>
      </div>
    </div>
  )
}

export default PropertyInformationPage
