/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Modal from '@/components/ui/Modal'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { CloseIcon, SupportIcon } from '@/components/icons'
import { BottomCTA, HeaderNavigation } from '@/features/app'
import useGetContract from '../api/get-contract'
import Invoice from '../../invoice/components/Invoice'
import useGetContractCommissionInvoice from '../../invoice/api/get-contract-commission-invoice'
import ContractClauses from '../components/Draft/ContractClauses'
import useContractLogic from '../hooks/use-contract-logic'
import { useRejectContract, useRevisionRequestContract } from '../api/contract-actions'
import useGetContractStatus from '../api/get-contract-status'
import ContractContent from '../components/Draft/ContractContent'
import useGetPrContractsParties from '../api/get-pr-contracts-parties'
import useGetPrContractProperty from '../api/get-pr-contract-property'
import { useGetContractPayments } from '@/features/contract'
import { handleErrorOnSubmit } from '@/utils/error'

function DraftInformation() {
  const router = useRouter()
  const { contractId } = router.query

  const [confirmModal, setConfirmModal] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [editSuccess, setEditSuccess] = useState(false)
  const [invoiceModal, setInvoiceModal] = useState(false)

  const contractQuery = useGetContract(contractId, { enabled: router.isReady })

  const contractStatusQuery = useGetContractStatus(contractId, { enabled: router.isReady })
  const partiesQuery = useGetPrContractsParties(contractId, { enabled: router.isReady })
  const propertyQuery = useGetPrContractProperty(contractId, { enabled: router.isReady })
  const paymentsQuery = useGetContractPayments(contractId, { enabled: router.isReady })

  const commissionQuery = useGetContractCommissionInvoice(contractId, {
    enabled: invoiceModal && router.isReady,
  })

  const { data: statuses } = contractStatusQuery

  const {
    signedByCurrentUser,
    currentUserIsOwner,
    isCurrentUserFirstSide,
    canViewDraft,
    canRejectOrRevisionRequest,
    hasRejectOrRevisionRequest,
  } = useContractLogic(statuses)

  const handleSign = () => {
    router.push(`/contracts/${contractId}/manage/sign`)
  }

  const rejectContract = useRejectContract(contractId)
  const revisionRequestContract = useRevisionRequestContract(contractId)

  const actionDraft = (action) => {
    if (action === 'REJECT') {
      rejectContract.mutate(null, {
        onSuccess: () => {
          setRejectModal(true)
          setConfirmModal(false)
          setTimeout(() => {
            router.push('/')
          }, 2000)
        },
        onError: (e) => {
          handleErrorOnSubmit(e)
        },
      })
    } else {
      revisionRequestContract.mutate(null, {
        onSuccess: () => {
          setEditSuccess(true)
          setConfirmModal(false)
          setTimeout(() => {
            router.push('/')
          }, 2000)
        },
        onError: (e) => {
          handleErrorOnSubmit(e)
        },
      })
    }
  }

  useEffect(() => {
    if (!propertyQuery?.data?.city?.name && !!router.isReady) {
      propertyQuery.refetch()
    }
  }, [propertyQuery, router.isReady])

  return (
    <>
      <HeaderNavigation title="پیش نویس اجاره نامه" />

      <div className="flex flex-col p-5 gap-6 flex-grow">
        <LoadingAndRetry skeletonItemCount={7} query={contractStatusQuery}>
          {canViewDraft ? (
            <LoadingAndRetry
              skeletonItemCount={7}
              query={[partiesQuery, propertyQuery, paymentsQuery, contractQuery]}
            >
              <ContractContent
                statuses={statuses}
                parties={partiesQuery.data}
                property={propertyQuery.data}
                payments={paymentsQuery.data}
                contract={contractQuery.data}
              />
              <ContractClauses
                parties={partiesQuery.data}
                property={propertyQuery.data}
                contract={contractQuery.data}
                canAddClause={!signedByCurrentUser && isCurrentUserFirstSide}
              />
            </LoadingAndRetry>
          ) : (
            <Alert variant="danger" className="text-center">
              برای مشاهده پیش‌نویس قرارداد، ابتدا اطلاعات قرارداد را تکمیل نمایید
            </Alert>
          )}
        </LoadingAndRetry>
      </div>

      <BottomCTA>
        {contractStatusQuery.isPending ? (
          <Skeleton className="h-14 px-4 py-2" />
        ) : !canViewDraft ? (
          <Button className="w-full" href={`/contracts/${contractId}/manage`} replace>
            مدیریت قرارداد
          </Button>
        ) : signedByCurrentUser ? (
          <Button className="w-full" href={`/contracts/${contractId}`}>
            مشاهده روند قرارداد
          </Button>
        ) : currentUserIsOwner ? (
          <div className="flex gap-3 mt-3">
            <Button className="w-full" onClick={() => handleSign()}>
              امضا
            </Button>

            <Button
              className="w-full"
              variant="outline"
              href={`/contracts/${contractId}/manage`}
              replace
            >
              ویرایش اطلاعات
            </Button>
          </div>
        ) : hasRejectOrRevisionRequest ? (
          <Button className="w-full" href={`/contracts/${contractId}`}>
            مشاهده روند قرارداد
          </Button>
        ) : (
          <div className="flex gap-3 mt-3">
            <Button className="w-full" onClick={() => handleSign()}>
              امضای قرارداد
            </Button>
            {canRejectOrRevisionRequest && (
              <Button className="w-full" variant="outline" onClick={() => setConfirmModal(true)}>
                درخواست ویرایش یا رد
              </Button>
            )}
          </div>
        )}
      </BottomCTA>

      <Modal
        open={invoiceModal}
        onClose={() => setInvoiceModal(false)}
        className="w-[400px] max-w-full fa"
      >
        <LoadingAndRetry query={commissionQuery}>
          {commissionQuery.data && (
            <Invoice invoice={commissionQuery.data} query={commissionQuery}>
              <Button className="w-1/2" onClick={() => handleSign()}>
                تایید
              </Button>
            </Invoice>
          )}
        </LoadingAndRetry>
      </Modal>

      <Modal open={confirmModal} onClose={() => setConfirmModal(false)}>
        <div>
          <div className="flex flex-col justify-center items-center gap-3 p-4">
            <div className="w-[47px] h-[47px] bg-green-600 rounded-full">
              <div className="text-white flex justify-center">
                <div className="mt-1">
                  <SupportIcon size={40} />
                </div>
              </div>
            </div>
            <div className="text-center">
              اگر میخوای قراردادتو ویرایش کنی کارشناس <br />
              ما با شما تماس میگیره.
            </div>
            <div>
              <div className="grid grid-cols-2 gap-3 mt-10">
                <Button
                  className="w-full"
                  onClick={() => actionDraft('EDIT')}
                  loading={revisionRequestContract.isPending}
                >
                  درخواست ویرایش
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => actionDraft('REJECT')}
                  loading={rejectContract.isPending}
                >
                  رد قرارداد
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal open={rejectModal} onClose={() => setRejectModal(false)}>
        <div className="p-5 px-12 flex flex-col gap-8 items-center">
          <div className="w-[47px] h-[47px] bg-rust-600 rounded-full">
            <div className="text-white flex justify-center">
              <div className="mt-1">
                <CloseIcon size={40} />
              </div>
            </div>
          </div>
          <div>قرارداد توسط شما رد شد.</div>
        </div>
      </Modal>
      <Modal open={editSuccess} onClose={() => setEditSuccess(false)}>
        <div>
          <div className="flex flex-col justify-center items-center gap-3 p-4">
            <div className="w-[47px] h-[47px] bg-green-600 rounded-full">
              <div className="text-white flex justify-center">
                <div className="mt-1">
                  <SupportIcon size={40} />
                </div>
              </div>
            </div>
            <div className="text-center">
              درخواست شما برای ویرایش قرارداد با
              <br /> موفقیت ثبت شد.
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default DraftInformation
