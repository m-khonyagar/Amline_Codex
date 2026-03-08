import { Form, InputField, useForm } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { useClauseContext } from '../providers/ClauseProvider'
import { CloseIcon, DocumentEditIcon, PlusIcon } from '@/components/icons'

const ClauseForm = ({ clause, nextClauseNumber, onSuccess, onCancel }) => {
  const isEditMode = !!clause?.id

  const {
    actions: { addClause, updateClause },
  } = useClauseContext()

  const methods = useForm({
    defaultValues: {
      clause_number: clause?.clause_number || nextClauseNumber,
      clause_name: clause?.clause_name || '',
      subclauses: clause?.subclauses || [],
    },
  })

  const handleSubmit = (data) => {
    isEditMode ? updateClause({ id: clause?.id, ...data }) : addClause(data)
    onSuccess?.()
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <InputField readOnly disabled label="شماره ماده" name="clause_number" />
        <p className="text-xs text-gray-500 -mt-4">شماره ماده به صورت خودکار تنظیم می‌شود</p>
      </div>

      <InputField required label="عنوان ماده" name="clause_name" />

      <div className="text-left">
        {onCancel && (
          <Button size="sm" variant="gray" onClick={onCancel}>
            <CloseIcon size={14} className="ml-1" /> انصراف
          </Button>
        )}

        <Button size="sm" type="submit" className="mr-2">
          {isEditMode ? (
            <>
              <DocumentEditIcon size={14} className="ml-1" /> ذخیره تغییرات
            </>
          ) : (
            <>
              <PlusIcon size={14} className="ml-1" /> ایجاد ماده
            </>
          )}
        </Button>
      </div>
    </Form>
  )
}

export default ClauseForm
