import Button from '@/components/ui/Button'
import { CloseIcon } from '@/components/icons'
import { toast } from '@/components/ui/Toaster'
import { handleErrorOnSubmit } from '@/utils/error'
import { useDeleteExchange } from '../../api/delete-exchange'

const BarterListDelete = ({ exchange, onCancel, onSuccess }) => {
  exchange = exchange || {}

  const deleteExchangeMutation = useDeleteExchange({
    onSuccess: (res) => {
      toast.success('معاوضه با موفقیت حذف شد')
      onSuccess?.(res)
    },
    onError: (e) => {
      handleErrorOnSubmit(e)
    },
  })

  return (
    <div>
      <div className="fa">
        آیا از حذف معاوضه <span className="font-bold">{exchange?.id}</span> مطمئن هستید؟
      </div>

      <div className="mt-4 flex items-center justify-end">
        <Button
          size="sm"
          variant="gray"
          onClick={onCancel}
          disabled={deleteExchangeMutation.isPending}
        >
          <CloseIcon size={14} className="ml-1" /> انصراف
        </Button>

        <Button
          size="sm"
          className="mr-2"
          variant="danger"
          loading={deleteExchangeMutation.isPending}
          onClick={() => deleteExchangeMutation.mutate(exchange?.id)}
        >
          حذف
        </Button>
      </div>
    </div>
  )
}

export default BarterListDelete
