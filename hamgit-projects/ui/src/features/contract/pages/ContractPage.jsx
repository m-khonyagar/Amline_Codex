import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { BottomCTA, HeaderNavigation } from '@/features/app'
import ContractNotFound from '../components/ContractNotFound'
import useGetContractStatus from '../api/get-contract-status'
import ContractProcessItem from '../components/ContractProcessItem'
import Button from '@/components/ui/Button'
import { getPrContractProcesses } from '../libs/contract-process'
import { contractTypeEnum, useContractLogic } from '@/features/contract'
import copyImg from '@/assets/images/copy.svg'
import { useCopy } from '@/hooks/use-copy'
import { toast } from '@/components/ui/Toaster'

function ContractPage() {
  const router = useRouter()
  const { contractId } = router.query

  const contractStatusQuery = useGetContractStatus(contractId, {
    enabled: router.isReady,
    refetchOnMount: true,
  })

  const { data: statuses } = contractStatusQuery

  const processes = useMemo(() => {
    return statuses
      ? getPrContractProcesses({
          contractId,
          contractType: contractTypeEnum.PROPERTY_RENT,
          statuses,
        })
      : []
  }, [statuses, contractId])

  const handlePushPaymentHistory = () => {
    router.push(`/contracts/${contractId}/payment-history`)
  }

  const { canViewDraft } = useContractLogic(statuses)

  const { isCopied, copy } = useCopy()
  useEffect(() => {
    if (isCopied) {
      toast.success('کپی شد')
    }
  }, [isCopied])

  return (
    <>
      <HeaderNavigation title="وضعیت قرارداد" href="/contracts" />
      <LoadingAndRetry
        query={[contractStatusQuery]}
        loadingClassName="p-6"
        skeletonItemHeight={69}
        skeletonItemCount={6}
      >
        {statuses && (
          <>
            <div className="p-6 fa text-sm flex gap-2.5 justify-center">
              <button
                type="button"
                className="flex gap-1 items-center"
                onClick={() => copy(contractId)}
              >
                <Image alt="copy" width={11} height={14} src={copyImg.src} />
                <span>شناسه قرارداد:</span>
                {contractId}
              </button>
              <button
                type="button"
                className="flex gap-1 items-center"
                onClick={() => copy(statuses.password)}
              >
                <Image alt="copy" width={11} height={14} src={copyImg.src} />
                <span>رمز:</span>
                {statuses.password}
              </button>
            </div>

            <div className="p-6 pt-0 flex flex-col gap-3">
              {processes.map((process, index) => (
                <ContractProcessItem key={`${index + 1}`} {...process} />
              ))}
            </div>

            <BottomCTA>
              <div className="grid grid-cols-2 gap-3 mt-5">
                <Button
                  disabled={!statuses?.steps?.ADMIN_APPROVE}
                  onClick={handlePushPaymentHistory}
                >
                  سابقه پرداخت
                </Button>

                <Button
                  variant="outline"
                  disabled={!canViewDraft}
                  href={`/contracts/${contractId}/draft`}
                >
                  پیش نویس قرارداد
                </Button>
              </div>
            </BottomCTA>
          </>
        )}
        {!statuses && !contractStatusQuery.isPending && <ContractNotFound />}
      </LoadingAndRetry>
    </>
  )
}

export default ContractPage
