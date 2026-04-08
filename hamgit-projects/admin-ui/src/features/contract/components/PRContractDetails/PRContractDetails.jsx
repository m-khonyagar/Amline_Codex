import { useState } from 'react'
import { cn } from '@/utils/dom'
import { format } from 'date-fns-jalali'
import { Dialog } from '@/components/ui/Dialog'
import { toast } from '@/components/ui/Toaster'
import { numberSeparator } from '@/utils/number'
import { handleErrorOnSubmit } from '@/utils/error'
import PRContractEditStatus from './PRContractEditStatus'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import PRContractEditDetails from './PRContractEditDetails'
import { useGetPRContractInfo } from '../../api/get-pr-contract-info'
import useReferPRContractToParties from '../../api/refer-pr-contract-to-parties'
import { CircleLoadingIcon, DocumentEditIcon, PencilIcon, SendIcon } from '@/components/icons'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'

const PRContractDetails = ({ contractId, className, onEditModeChange }) => {
  const [editMode, setEditMode] = useState(false)
  const [isOpenEditStatusDialog, setIsOpenEditStatusDialog] = useState(false)
  const [isOpenActions, setIsOpenActions] = useState(false)

  const prContractQuery = useGetPRContractInfo(contractId)
  const referToPartiesMutation = useReferPRContractToParties(contractId)

  const prContract = prContractQuery.data

  const toggleEditMode = (s) => {
    setEditMode(s)
    onEditModeChange?.(s)
  }

  const toggleIsOpenActions = (s) => {
    if (referToPartiesMutation.isPending) {
      return
    }

    setIsOpenActions(s)
  }

  const handleReferToParties = (e) => {
    e.preventDefault()

    referToPartiesMutation.mutate(
      {},
      {
        onSuccess: () => {
          toast.success('ارجاع با موفقیت انجام شد.')
        },
        onError: (e) => {
          handleErrorOnSubmit(e)
        },
        onSettled: () => {
          toggleIsOpenActions(false)
        },
      }
    )
  }

  return (
    <div className={cn('', className)}>
      <LoadingAndRetry query={prContractQuery} checkRefetching>
        {prContract &&
          (editMode ? (
            <PRContractEditDetails
              prContract={prContract}
              onCancel={() => toggleEditMode(false)}
              onSuccess={() => toggleEditMode(false)}
            />
          ) : (
            <>
              <div className="mb-4">
                <DropdownMenu open={isOpenActions} onOpenChange={(s) => toggleIsOpenActions(s)}>
                  <DropdownMenuTrigger asChild>
                    <button className="mr-auto text-sm border rounded-lg px-3 py-1 outline-none hover:bg-gray-200 flex items-center gap-2">
                      <PencilIcon size={16} />
                      عملیات
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent dir="rtl" align="end">
                    <DropdownMenuItem
                      disabled={referToPartiesMutation.isPending}
                      onClick={() => toggleEditMode(true)}
                    >
                      <DocumentEditIcon size={16} />
                      ویرایش جزییات
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      disabled={referToPartiesMutation.isPending}
                      onClick={() => setIsOpenEditStatusDialog(true)}
                    >
                      <DocumentEditIcon size={16} />
                      ویرایش وضعیت
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      disabled={referToPartiesMutation.isPending}
                      onClick={(e) => handleReferToParties(e)}
                    >
                      {referToPartiesMutation.isPending ? (
                        <CircleLoadingIcon size={16} className="animate-spin" />
                      ) : (
                        <SendIcon size={16} />
                      )}
                      ارجاع به کاربر
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="bg-white rounded-lg py-2 fa flex flex-wrap">
                <div className="md:basis-1/2 py-2 px-4 flex-grow flex flex-col gap-4 md:border-l">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-700">تاریخ عقد قرارداد:</div>
                    <div className="mr-auto">
                      {prContract.contract?.date
                        ? format(prContract.contract.date, 'dd MMMM yyyy')
                        : '-'}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-700">تاریخ شروع:</div>
                    <div className="mr-auto">
                      {prContract.start_date ? format(prContract.start_date, 'dd MMMM yyyy') : '-'}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-700">تاریخ پایان:</div>
                    <div className="mr-auto">
                      {prContract.end_date ? format(prContract.end_date, 'dd MMMM yyyy') : '-'}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-700">تاریخ تحویل ملک:</div>
                    <div className="mr-auto">
                      {prContract.property_handover_date
                        ? format(prContract.property_handover_date, 'dd MMMM yyyy')
                        : '-'}
                    </div>
                  </div>
                </div>
                <div className="md:basis-1/2 py-2 px-4 flex-grow flex flex-col gap-4">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-700">وجه التزام از مستاجر:</div>
                    <div className="mr-auto">
                      {prContract.tenant_penalty_fee
                        ? numberSeparator(prContract.tenant_penalty_fee)
                        : '-'}
                      <span className="text-sm text-gray-500 mr-1">تومان</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-700">وجه التزام از موجر:</div>
                    <div className="mr-auto">
                      {prContract.landlord_penalty_fee
                        ? numberSeparator(prContract.landlord_penalty_fee)
                        : '-'}
                      <span className="text-sm text-gray-500 mr-1">تومان</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-700">نعداد مستاجران</div>
                    <div className="mr-auto">
                      {prContract.tenant_family_members_count
                        ? prContract.tenant_family_members_count
                        : '-'}
                      <span className="text-sm text-gray-500 mr-1">نفر</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}
      </LoadingAndRetry>

      <Dialog
        closeOnBackdrop={false}
        open={isOpenEditStatusDialog}
        onOpenChange={(s) => setIsOpenEditStatusDialog(s)}
        title={`ویرایش وضعیت`}
      >
        <PRContractEditStatus
          prContract={prContract}
          onCancel={() => setIsOpenEditStatusDialog(false)}
          onSuccess={() => setIsOpenEditStatusDialog(false)}
        />
      </Dialog>
    </div>
  )
}

export default PRContractDetails
