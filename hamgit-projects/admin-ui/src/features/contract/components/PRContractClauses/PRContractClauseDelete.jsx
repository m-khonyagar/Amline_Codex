import Button from '@/components/ui/Button'
import { CloseIcon } from '@/components/icons'
import { toast } from '@/components/ui/Toaster'
import { handleErrorOnSubmit } from '@/utils/error'
import useDeleteContractClause from '../../api/delete-contract-clause'

const PRContractClauseDelete = ({ contractId, clause, onCancel, onSuccess }) => {
  clause = clause || {}

  const deleteContractClauseMutation = useDeleteContractClause(contractId, {
    onSuccess: (res) => {
      toast.success(`بند قرارداد حذف شد.`)

      onSuccess?.(res)
    },
    onError: (e) => {
      handleErrorOnSubmit(e)
    },
  })

  return (
    <div>
      <div className="fa">
        آیا از حذف{' '}
        <span className="font-bold">
          بند {clause.subclause_number} ماده {clause.clause_name}
        </span>{' '}
        تومان مطمئن هستید؟
      </div>

      <div className="mt-4 flex items-center justify-end">
        <Button
          size="sm"
          variant="gray"
          onClick={onCancel}
          disabled={deleteContractClauseMutation.isPending}
        >
          <CloseIcon size={14} className="ml-1" /> انصراف
        </Button>
        <Button
          size="sm"
          className="mr-2"
          variant="danger"
          loading={deleteContractClauseMutation.isPending}
          onClick={() => deleteContractClauseMutation.mutate(clause.id)}
        >
          حذف
        </Button>
      </div>
    </div>
  )
}

export default PRContractClauseDelete
