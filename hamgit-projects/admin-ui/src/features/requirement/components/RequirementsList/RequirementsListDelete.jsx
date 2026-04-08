import Button from '@/components/ui/Button'
import { CloseIcon } from '@/components/icons'
import { toast } from '@/components/ui/Toaster'
import { handleErrorOnSubmit } from '@/utils/error'
import { useDeleteRequirement } from '../../api/delete-requirement'

const RequirementsListDelete = ({ requirement, onCancel, onSuccess }) => {
  requirement = requirement || {}

  const deleteRequirementMutation = useDeleteRequirement({
    onSuccess: (res) => {
      toast.success('نیازمندی با موفقیت حذف شد')
      onSuccess?.(res)
    },
    onError: (e) => {
      handleErrorOnSubmit(e)
    },
  })

  return (
    <div>
      <div className="fa">
        آیا از حذف نیازمندی <span className="font-bold">{requirement?.id}</span> مطمئن هستید؟
      </div>

      <div className="mt-4 flex items-center justify-end">
        <Button
          size="sm"
          variant="gray"
          onClick={onCancel}
          disabled={deleteRequirementMutation.isPending}
        >
          <CloseIcon size={14} className="ml-1" /> انصراف
        </Button>

        <Button
          size="sm"
          className="mr-2"
          variant="danger"
          loading={deleteRequirementMutation.isPending}
          onClick={() => deleteRequirementMutation.mutate(requirement?.id)}
        >
          حذف
        </Button>
      </div>
    </div>
  )
}

export default RequirementsListDelete
