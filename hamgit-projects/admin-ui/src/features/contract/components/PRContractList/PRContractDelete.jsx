import Button from '@/components/ui/Button'
import { CloseIcon } from '@/components/icons'
import { toast } from '@/components/ui/Toaster'
import { handleErrorOnSubmit } from '@/utils/error'
import useDeletePRContract from '../../api/delete-pr-contract'

const PRContractDelete = ({ prContract, onCancel, onSuccess }) => {
  prContract = prContract || {}

  const deletePRcontractMutation = useDeletePRContract(prContract?.id, {
    onSuccess: (res) => {
      toast.success(`قرارداد حذف شد.`)

      onSuccess?.(res)
    },
    onError: (e) => {
      handleErrorOnSubmit(e)
    },
  })

  return (
    <div>
      <div className="fa">
        آیا از حذف قرارداد <span className="font-bold">{prContract.id}</span> مطمئن هستید؟
      </div>

      <div className="mt-4 flex items-center justify-end">
        <Button
          size="sm"
          variant="gray"
          onClick={onCancel}
          disabled={deletePRcontractMutation.isPending}
        >
          <CloseIcon size={14} className="ml-1" /> انصراف
        </Button>
        <Button
          size="sm"
          className="mr-2"
          variant="danger"
          loading={deletePRcontractMutation.isPending}
          onClick={() => deletePRcontractMutation.mutate(prContract?.id)}
        >
          حذف
        </Button>
      </div>
    </div>
  )
}

export default PRContractDelete
