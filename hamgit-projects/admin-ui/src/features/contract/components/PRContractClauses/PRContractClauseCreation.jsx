import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'
import { pickWithDefaults } from '@/utils/object'
import { handleErrorOnSubmit } from '@/utils/error'
import { Form, InputField, useForm } from '@/components/ui/Form'
import { CloseIcon, DocumentEditIcon, PlusIcon } from '@/components/icons'
import useUpdateContractClause from '../../api/update-contract-clause'
import useCreateContractClause from '../../api/create-contract-clause'

const PRContractClauseCreation = ({ contractId, clause, onCancel, onSuccess }) => {
  const isEditMode = !!clause?.id

  const methods = useForm({
    defaultValues: pickWithDefaults(clause, {
      body: '',
    }),
  })

  const createClauseMutation = useCreateContractClause(contractId)
  const updateClauseMutation = useUpdateContractClause(contractId, clause?.id)

  const mutation = isEditMode ? updateClauseMutation : createClauseMutation

  const handleSubmit = (data, { setError }) => {
    mutation.mutate(data, {
      onSuccess: (res) => {
        toast.success(
          isEditMode
            ? `بند قرارداد با موفقیت ویرایش شد.`
            : `بند جدید در ماده ${res.data.clause_name} با موفقیت اضافه شد.`
        )

        onSuccess(res)
      },
      onError: (e) => {
        handleErrorOnSubmit(e, setError, data)
      },
    })
  }

  return (
    <div>
      <Form methods={methods} onSubmit={handleSubmit}>
        <InputField required multiline label="متن بند" name="body" style={{ height: '220px' }} />

        <div className="text-left">
          <Button size="sm" variant="gray" onClick={onCancel} disabled={mutation.isPending}>
            <CloseIcon size={14} className="ml-1" /> انصراف
          </Button>
          <Button size="sm" type="submit" className="mr-2" loading={mutation.isPending}>
            {isEditMode ? (
              <>
                <DocumentEditIcon size={14} className="ml-1" /> ویرایش
              </>
            ) : (
              <>
                <PlusIcon size={14} className="ml-1" /> ایجاد
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default PRContractClauseCreation
