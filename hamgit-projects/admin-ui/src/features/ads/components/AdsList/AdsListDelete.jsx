import Button from '@/components/ui/Button'
import { CloseIcon } from '@/components/icons'
import { toast } from '@/components/ui/Toaster'
import { handleErrorOnSubmit } from '@/utils/error'
import { useDeleteAd } from '../../api/delete-ad'

const AdsListDelete = ({ ad, onCancel, onSuccess }) => {
  ad = ad || {}

  const deleteAdMutation = useDeleteAd({
    onSuccess: (res) => {
      toast.success('آگهی با موفقیت حذف شد')
      onSuccess?.(res)
    },
    onError: (e) => {
      handleErrorOnSubmit(e)
    },
  })

  return (
    <div>
      <div className="fa">
        آیا از حذف آگهی <span className="font-bold">{ad?.id}</span> مطمئن هستید؟
      </div>

      <div className="mt-4 flex items-center justify-end">
        <Button size="sm" variant="gray" onClick={onCancel} disabled={deleteAdMutation.isPending}>
          <CloseIcon size={14} className="ml-1" /> انصراف
        </Button>

        <Button
          size="sm"
          className="mr-2"
          variant="danger"
          loading={deleteAdMutation.isPending}
          onClick={() => deleteAdMutation.mutate(ad?.id)}
        >
          حذف
        </Button>
      </div>
    </div>
  )
}

export default AdsListDelete
