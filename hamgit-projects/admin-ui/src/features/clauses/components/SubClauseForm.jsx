import { CheckboxField, Form, InputField, useForm } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'
import { useClauseContext } from '../providers/ClauseProvider'
import { CloseIcon, DocumentEditIcon, PlusIcon } from '@/components/icons'

const replacements = {
  '<tenant_count>': 'تعداد اعضای خانواده مستاجر',
  '<property_type>': 'نوع ملک',
  '<tenant_penalty_fee>': 'جریمه مستاجر',
  '<landlord_penalty_fee>': 'جریمه مالک',
}

const SubClauseForm = ({ subClause, nextSubClauseNumber, onSuccess, onCancel }) => {
  const isEditMode = !!subClause?.id

  const {
    actions: { addSubclause, updateSubclause },
  } = useClauseContext()

  const methods = useForm({
    defaultValues: {
      subclause_number: subClause?.subclause_number || nextSubClauseNumber,
      subclause_name: subClause?.subclause_name || '',
      body: subClause?.body || '',
      is_editable: subClause?.is_editable || false,
      is_deletable: subClause?.is_deletable || false,
    },
  })

  const handleSubmit = (data) => {
    isEditMode
      ? updateSubclause(subClause?.parentId, { id: subClause?.id, ...data })
      : addSubclause(subClause?.parentId, data)
    onSuccess?.()
  }

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.info(`"${text}" کپی شد`)
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <InputField readOnly disabled label="شماره ماده" name="subclause_number" />
        <p className="text-xs text-gray-500 -mt-4">شماره ماده به صورت خودکار تنظیم می‌شود</p>
      </div>

      <InputField label="عنوان ماده" name="subclause_name" />

      <InputField multiline required label="متن" name="body" />

      <div className="text-sm text-gray-700 mt-2">
        <p className="font-semibold mb-2">علائم قابل استفاده:</p>
        <ul className="flex items-center flex-wrap gap-x-8 gap-y-1">
          {Object.entries(replacements).map(([key, description]) => (
            <li
              key={key}
              className="cursor-pointer text-blue-500 hover:underline"
              onClick={() => handleCopyToClipboard(key)}
            >
              {key}: {description}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex item-center gap-8">
        <CheckboxField label="قابل ویرایش" name="is_editable" />

        <CheckboxField label="قابل حذف" name="is_deletable" />
      </div>

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

export default SubClauseForm
