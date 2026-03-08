import { useState } from 'react'
import { cn } from '@/utils/dom'
import Button from '@/components/ui/Button'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { useGetPRContractDescriptions } from '../api/get-pr-contract-description'
import { useSendPRContractDescriptions } from '../api/send-pr-contract-descriptions'
import { formatDate } from '@/utils/date'
import { Dialog } from '@/components/ui/Dialog'
import { Textarea } from '@/components/ui/Textarea'
import { handleErrorOnSubmit } from '@/utils/error'
import { toast } from '@/components/ui/Toaster'

const PRContractDescriptions = ({ contractId, className }) => {
  const prContractDescriptionsQuery = useGetPRContractDescriptions(contractId)
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false)
  const [descriptionText, setDescriptionText] = useState('')

  const sendMutation = useSendPRContractDescriptions({
    onSuccess: () => {
      prContractDescriptionsQuery.refetch()
      toast.success('توضیح با موفقیت ثبت شد')
      setDescriptionText('')
      setIsOpenEditDialog(false)
    },
    onError: handleErrorOnSubmit,
  })

  const handleSubmitDescription = async () => {
    if (!descriptionText.trim()) {
      toast.error('لطفا توضیح را وارد کنید')
      return
    }

    sendMutation.mutate({
      contract_id: Number(contractId),
      text: descriptionText.trim(),
    })
  }

  const handleDialogOpenChange = (open) => {
    setIsOpenEditDialog(open)
    if (!open) {
      setDescriptionText('')
    }
  }

  return (
    <div className={cn('mt-4 fa', className)}>
      <div className="border-b mb-4 flex flex-wrap items-center min-h-[44px]">
        <h2 className="font-semibold my-2">توضیحات</h2>

        <Button
          size="xs"
          variant="gray"
          className="mr-auto my-2"
          onClick={() => setIsOpenEditDialog(true)}
        >
          ثبت توضیح
        </Button>
      </div>

      <LoadingAndRetry query={prContractDescriptionsQuery} checkRefetching>
        <div className="bg-white rounded-lg flex flex-col gap-4 py-4 px-4 w-full h-[342px] overflow-y-auto">
          {Array.isArray(prContractDescriptionsQuery.data) &&
          prContractDescriptionsQuery.data.length > 0 ? (
            prContractDescriptionsQuery.data.map((item) => (
              <div key={item.id} className="w-full border rounded-md p-2 md:p-4">
                <div className="float-left">
                  <div className="inline-flex flex-col p-1">
                    <span className="font-semibold text-sm text-gray-800">
                      {item.created_by?.fullname || 'کاربر'}
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(item.created_at)}</span>
                  </div>
                </div>

                <div className="leading-relaxed text-gray-900">{item.text}</div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-gray-500">توضیحی وجود ندارد</div>
          )}
        </div>
      </LoadingAndRetry>

      <Dialog
        closeOnBackdrop={false}
        open={isOpenEditDialog}
        onOpenChange={handleDialogOpenChange}
        title="ثبت توضیح"
      >
        <div className="w-full flex flex-col gap-4">
          <Textarea
            placeholder="توضیح خود را وارد کنید"
            value={descriptionText}
            onChange={(e) => setDescriptionText(e.target.value)}
            className="min-h-[120px]"
          />

          <div className="flex items-center justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={sendMutation.isPending}
              onClick={() => handleDialogOpenChange(false)}
            >
              انصراف
            </Button>
            <Button size="sm" loading={sendMutation.isPending} onClick={handleSubmitDescription}>
              ثبت توضیح
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default PRContractDescriptions
