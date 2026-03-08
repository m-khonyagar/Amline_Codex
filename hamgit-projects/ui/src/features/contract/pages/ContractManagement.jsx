import { useMemo } from 'react'
import { useRouter } from 'next/router'
import NavigationItem from '../components/NavigationItem'
import { getContractSteps } from '../libs/contract-steps'
import { BottomCTA, HeaderNavigation } from '@/features/app'
import { contractTypeEnum, prContractPartyTypeEnum, useContractLogic } from '@/features/contract'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import useNotifyOwner from '../api/notify-owner'
import { handleErrorOnSubmit } from '@/utils/error'
import { toast } from '@/components/ui/Toaster'
import useGetContractStatus from '../api/get-contract-status'

function ContractManagementPage() {
  const router = useRouter()
  const { contractId } = router.query
  const notifyOwnerMutation = useNotifyOwner(contractId)
  const contractStatusQuery = useGetContractStatus(contractId, { enabled: router.isReady })
  const { data: statuses } = contractStatusQuery

  const { signedByCurrentUser, canViewDraft } = useContractLogic(statuses)
  const ownerPartyType = statuses?.owner_party_type
  const currentUserPartyType = statuses?.current_user_party_type

  const steps = useMemo(() => {
    return statuses
      ? getContractSteps({
          contractType: contractTypeEnum.PROPERTY_RENT,
          statuses,
        })
      : []
  }, [statuses])

  const handleNotifyOwner = () => {
    notifyOwnerMutation.mutate(
      {},
      {
        onSuccess: (res) => {
          toast.success(res?.data?.message)
          router.replace(`/contracts/${contractId}`)
        },

        onError: (err) => {
          handleErrorOnSubmit(err)
        },
      }
    )
  }

  return (
    <div>
      <HeaderNavigation title="مدیریت قرارداد" backUrl="/contracts" />

      <div className="px-6 mt-6 flex flex-col gap-4">
        <LoadingAndRetry skeletonItemCount={5} skeletonItemHeight={45} query={contractStatusQuery}>
          {contractStatusQuery.data &&
            steps.map((step) => (
              <NavigationItem
                key={step.title}
                label={step.title}
                completed={step.completed}
                disabled={step.link === 'draft' ? !canViewDraft : step.disabled}
                href={
                  step.link === 'draft' || !signedByCurrentUser
                    ? `/contracts/${contractId}/manage/${step.link}`
                    : null
                }
              />
            ))}

          {signedByCurrentUser && (
            <Alert variant="success">
              قرارداد توسط شما امضا شده است.
              <Button size="sm" variant="link" href={`/contracts/${contractId}`}>
                مشاهده روند قرارداد
              </Button>
            </Alert>
          )}
        </LoadingAndRetry>
      </div>

      {ownerPartyType === prContractPartyTypeEnum.TENANT &&
        currentUserPartyType === prContractPartyTypeEnum.TENANT && (
          <BottomCTA>
            <Button
              className="w-full"
              disabled={
                contractStatusQuery.isPending ||
                steps
                  ?.filter((s) => ['renter-data', 'owner-data', 'date-payment'].includes(s.link))
                  .some((s) => !s.completed)
              }
              loading={notifyOwnerMutation.isPending}
              onClick={handleNotifyOwner}
            >
              تایید و ارسال برای مالک
            </Button>
          </BottomCTA>
        )}
    </div>
  )
}

export default ContractManagementPage
